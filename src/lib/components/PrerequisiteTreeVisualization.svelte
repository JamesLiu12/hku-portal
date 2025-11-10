<script lang="ts">
	import type {
		SimpleTree,
		PrerequisiteNode,
		PrerequisiteRelationship,
		ProgressStatus
	} from '$lib/data/mockPrerequisiteTrees';

	let { tree } = $props<{ tree: SimpleTree }>();

	const courseNodeWidth = 180;
	const courseNodeHeight = 100;
	const groupNodeWidth = 140;
	const groupNodeHeight = 60;
	const horizontalSpacing = 48;
	const verticalSpacing = 140;
	const horizontalPadding = 48;
	const verticalPadding = 48;

	type VisualNode = {
		id: string;
		type: 'course' | 'group';
		code?: string;
		name: string;
		status?: ProgressStatus;
		operator?: 'AND' | 'OR';
		relationship?: PrerequisiteRelationship;
		x: number;
		y: number;
		width: number;
		height: number;
		depth: number;
		isRoot?: boolean;
	};

	type PendingEdge = {
		id: string;
		fromId: string;
		toId: string;
		relationship: PrerequisiteRelationship;
	};

	type VisualEdgeSegment = {
		id: string;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		relationship: PrerequisiteRelationship;
	};

	function isGroupNode(node: PrerequisiteNode): node is Extract<PrerequisiteNode, { type: 'group' }> {
		return node.type === 'group';
	}

	function getChildren(node: PrerequisiteNode): PrerequisiteNode[] {
		return isGroupNode(node) ? node.children : node.prerequisites ?? [];
	}

	function getNodeDimensions(nodeType: 'course' | 'group'): { width: number; height: number } {
		return nodeType === 'course'
			? { width: courseNodeWidth, height: courseNodeHeight }
			: { width: groupNodeWidth, height: groupNodeHeight };
	}

	function getStatusColor(status: ProgressStatus): string {
		switch (status) {
			case 'completed':
				return '#10b981'; // green-500
			case 'eligible':
				return '#f59e0b'; // yellow-500
			case 'not-met':
				return '#ef4444'; // red-500
		}
	}

	function getStatusIcon(status: ProgressStatus): string {
		switch (status) {
			case 'completed':
				return '✓';
			case 'eligible':
				return '⚑';
			case 'not-met':
				return '✗';
		}
	}

	function getStatusLabel(status: ProgressStatus): string {
		switch (status) {
			case 'completed':
				return 'Completed';
			case 'eligible':
				return 'Eligible';
			case 'not-met':
				return 'Not met';
		}
	}

	const layout = $derived.by(() => calculateVisuals());
	const visualNodes = $derived.by(() => layout.nodes);
	const visualEdges = $derived.by(() => layout.edges);
	const svgWidth = $derived.by(() => layout.width);
	const svgHeight = $derived.by(() => layout.height);

	function calculateVisuals(): {
		nodes: VisualNode[];
		edges: VisualEdgeSegment[];
		width: number;
		height: number;
	} {
		if (!tree) {
			return {
				nodes: [],
				edges: [],
				width: courseNodeWidth + horizontalPadding * 2,
				height: courseNodeHeight + verticalPadding * 2
			};
		}

		const rootNode: PrerequisiteNode = {
			type: 'course',
			code: tree.courseCode,
			name: tree.courseName,
			status: tree.status,
			prerequisites: tree.prerequisites ?? []
		};

		const nodes: VisualNode[] = [];
		const pendingEdges: PendingEdge[] = [];

		let idCounter = 0;
		const levelHeight = courseNodeHeight + verticalSpacing;
		const widthCache = new Map<PrerequisiteNode, number>();

		const nextId = () => {
			idCounter += 1;
			return `node-${idCounter}`;
		};

		const computeSubtreeWidth = (node: PrerequisiteNode): number => {
			if (widthCache.has(node)) {
				return widthCache.get(node)!;
			}

			const { width: nodeWidth } = getNodeDimensions(node.type);
			const children = getChildren(node);

			if (!children.length) {
				widthCache.set(node, nodeWidth);
				return nodeWidth;
			}

			const childWidths = children.map(child => computeSubtreeWidth(child));
			const childrenSpan = childWidths.reduce(
				(acc, w, index) => acc + w + (index > 0 ? horizontalSpacing : 0),
				0
			);
			const totalWidth = Math.max(childrenSpan, nodeWidth);
			widthCache.set(node, totalWidth);
			return totalWidth;
		};

		const traverse = (
			node: PrerequisiteNode,
			depth: number,
			xStart: number,
			parentContext?: { id: string; type: 'course' | 'group'; operator?: 'AND' | 'OR' },
			isRoot = false
		) => {
			const subtreeWidth = computeSubtreeWidth(node);
			const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node.type);
			const nodeId = nextId();
			const nodeX = xStart + subtreeWidth / 2 - nodeWidth / 2;
			const nodeY = depth * levelHeight;

			const displayName =
				node.type === 'group'
					? node.label ?? (node.operator === 'OR' ? 'OR group' : 'AND group')
					: node.name;

			const visualNode: VisualNode = {
				id: nodeId,
				type: node.type,
				code: node.type === 'course' ? node.code : undefined,
				name: displayName,
				status: node.type === 'course' ? node.status : undefined,
				operator: node.type === 'group' ? node.operator : undefined,
				relationship: node.relationship,
				x: nodeX,
				y: nodeY,
				width: nodeWidth,
				height: nodeHeight,
				depth,
				isRoot
			};

			nodes.push(visualNode);

			if (parentContext) {
				const relationship =
					parentContext.type === 'group'
						? parentContext.operator === 'OR'
							? 'or'
							: 'and'
						: node.relationship ?? 'and';

				pendingEdges.push({
					id: `${parentContext.id}->${nodeId}`,
					fromId: parentContext.id,
					toId: nodeId,
					relationship
				});
			}

			const children = getChildren(node);

			if (!children.length) {
				return;
			}

			const childWidths = children.map(child => computeSubtreeWidth(child));
			const childrenSpan = childWidths.reduce(
				(acc, w, index) => acc + w + (index > 0 ? horizontalSpacing : 0),
				0
			);

			let cursor = xStart;
			if (childrenSpan < subtreeWidth) {
				cursor += (subtreeWidth - childrenSpan) / 2;
			}

			children.forEach((child, index) => {
				const childWidth = childWidths[index];
				traverse(
					child,
					depth + 1,
					cursor,
					{
						id: nodeId,
						type: node.type,
						operator: isGroupNode(node) ? node.operator : undefined
					},
					false
				);
				cursor += childWidth;
				if (index < children.length - 1) {
					cursor += horizontalSpacing;
				}
			});
		};

		traverse(rootNode, 0, 0, undefined, true);

		if (!nodes.length) {
			return {
				nodes: [],
				edges: [],
				width: courseNodeWidth + horizontalPadding * 2,
				height: courseNodeHeight + verticalPadding * 2
			};
		}

		let minX = Number.POSITIVE_INFINITY;
		let minY = Number.POSITIVE_INFINITY;
		let maxX = Number.NEGATIVE_INFINITY;
		let maxY = Number.NEGATIVE_INFINITY;

		nodes.forEach(node => {
			minX = Math.min(minX, node.x);
			minY = Math.min(minY, node.y);
			maxX = Math.max(maxX, node.x + node.width);
			maxY = Math.max(maxY, node.y + node.height);
		});

		if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
			minX = 0;
			maxX = courseNodeWidth;
		}
		if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
			minY = 0;
			maxY = courseNodeHeight;
		}

		const shiftX = horizontalPadding - minX;
		const shiftY = verticalPadding - minY;

		nodes.forEach(node => {
			node.x += shiftX;
			node.y += shiftY;
		});

		const width = maxX - minX + horizontalPadding * 2;
		const height = maxY - minY + verticalPadding * 2;

		const nodeMap = new Map(nodes.map(node => [node.id, node]));
		const edges: VisualEdgeSegment[] = pendingEdges
			.map(edge => {
				const fromNode = nodeMap.get(edge.fromId);
				const toNode = nodeMap.get(edge.toId);

				if (!fromNode || !toNode) return null;

				return {
					id: edge.id,
					x1: fromNode.x + fromNode.width / 2,
					y1: fromNode.y + fromNode.height,
					x2: toNode.x + toNode.width / 2,
					y2: toNode.y,
					relationship: edge.relationship
				};
			})
			.filter(Boolean) as VisualEdgeSegment[];

		return {
			nodes,
			edges,
			width: Math.max(width, courseNodeWidth + horizontalPadding * 2),
			height: Math.max(height, courseNodeHeight + verticalPadding * 2)
		};
	}
</script>

{#if tree && tree.prerequisites && Array.isArray(tree.prerequisites) && tree.prerequisites.length > 0}
	<div class="w-full overflow-x-auto overflow-y-hidden bg-white rounded-lg border border-gray-200 p-6 touch-pan-x">
		<div class="mx-auto" style="max-width: {svgWidth}px;">
			<svg
				class="w-full h-auto"
				viewBox="0 0 {svgWidth} {svgHeight}"
				preserveAspectRatio="xMidYMin meet"
			>
				<defs>
					<marker id="solidArrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
						<polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
					</marker>
					<marker id="dashedArrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
						<polygon points="0 0, 10 3, 0 6" fill="#4b5563" />
					</marker>
				</defs>

				<!-- Edges -->
				<g fill="none">
					{#each visualEdges as edge}
						<path
							d={`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`}
							stroke={edge.relationship === 'or' ? '#4b5563' : '#6b7280'}
							stroke-width="2.5"
							stroke-dasharray={edge.relationship === 'or' ? '6 6' : undefined}
							marker-end={`url(#${edge.relationship === 'or' ? 'dashedArrowhead' : 'solidArrowhead'})`}
						/>
					{/each}
				</g>

				<!-- Nodes -->
				{#each visualNodes as node (node.id)}
					<g transform={`translate(${node.x}, ${node.y})`}>
						{#if node.type === 'course'}
							<rect
								width={node.width}
								height={node.height}
								rx="10"
								fill={node.status ? getStatusColor(node.status) : '#1f2937'}
								stroke="#1f2937"
								stroke-width="2"
								class="drop-shadow"
							/>
							<foreignObject width={node.width} height={node.height}>
								<div class="flex h-full flex-col items-center justify-center p-3 text-white text-center gap-1">
									<div class="text-xs font-medium opacity-75">
										{#if node.isRoot}
											Target Course
										{:else if node.status}
										{getStatusIcon(node.status)} {getStatusLabel(node.status)}
										{/if}
									</div>
									{#if node.code}
										<div class="text-sm font-bold">{node.code}</div>
									{/if}
									<div class="text-xs leading-tight opacity-90">{node.name}</div>
								</div>
							</foreignObject>
						{:else}
							<rect
								width={node.width}
								height={node.height}
								rx="12"
								fill="#f3f4f6"
								stroke="#4b5563"
								stroke-dasharray="4 4"
								stroke-width="2"
							/>
							<foreignObject width={node.width} height={node.height}>
								<div class="flex h-full flex-col items-center justify-center gap-1 px-3 text-center text-gray-700">
									<div class="text-xs font-semibold uppercase tracking-wide">
										{node.operator === 'OR' ? 'OR group' : 'AND group'}
									</div>
									<div class="text-xs leading-tight">{node.name}</div>
								</div>
							</foreignObject>
						{/if}
					</g>
				{/each}
			</svg>
		</div>

		<!-- Legend -->
		<div class="mt-6 grid gap-4 text-sm md:grid-cols-3">
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-green-500"></div>
				<span>Completed</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-yellow-500"></div>
				<span>Eligible (requirements satisfied)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-red-500"></div>
				<span>Not met</span>
			</div>
			<div class="flex items-center gap-2 md:col-span-3">
				<div class="h-4 w-4 rounded border border-dashed border-gray-500 bg-gray-100"></div>
				<span>Gray dashed boxes group alternative or combined requirements</span>
			</div>
			<div class="flex items-center gap-2 md:col-span-3">
				<div class="h-[2px] w-6 border-t border-dashed border-gray-500"></div>
				<span>Dashed arrows indicate alternative (OR) pathways</span>
			</div>
		</div>
	</div>
{/if}
