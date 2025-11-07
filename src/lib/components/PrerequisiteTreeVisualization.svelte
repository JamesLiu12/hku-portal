<script lang="ts">
	import type { SimpleTree } from '$lib/data/mockPrerequisiteTrees';
	
	let { tree } = $props<{ tree: SimpleTree }>();
	
	function getStatusColor(status: 'met' | 'partial' | 'not-met'): string {
		switch (status) {
			case 'met':
				return '#10b981'; // green-500
			case 'partial':
				return '#f59e0b'; // yellow-500
			case 'not-met':
				return '#ef4444'; // red-500
		}
	}
	
	function getStatusIcon(status: 'met' | 'partial' | 'not-met'): string {
		switch (status) {
			case 'met':
				return '✓';
			case 'partial':
				return '⚠';
			case 'not-met':
				return '✗';
		}
	}
	
// Calculate positions for nodes (simple horizontal layout)
const nodeWidth = 180;
const nodeHeight = 100;
const horizontalSpacing = 40;
const verticalSpacing = 120;
const horizontalPadding = 32;
const verticalPadding = 32;
	
type LayoutNode = {
	code: string;
	name: string;
	status: string;
	x: number;
	y: number;
	hasChildren: boolean;
	parentIndex?: number;
};

function calculateLayout(): { levels: LayoutNode[][]; width: number; height: number } {
	const levels: LayoutNode[][] = [];

	if (!tree || !tree.prerequisites || tree.prerequisites.length === 0) {
		return {
			levels,
			width: nodeWidth + horizontalPadding * 2,
			height: nodeHeight + verticalPadding * 2
		};
	}

	// Level 0: Root node
	const rootY = 0;
	levels.push([
		{
			code: tree.courseCode,
			name: tree.courseName,
			status: tree.status,
			x: 0,
			y: rootY,
			hasChildren: tree.prerequisites && tree.prerequisites.length > 0
		}
	]);

	// Level 1: Direct prerequisites
	if (tree.prerequisites && tree.prerequisites.length > 0) {
		const level1Nodes: LayoutNode[] = [];
		const totalWidth =
			tree.prerequisites.length * nodeWidth +
			(tree.prerequisites.length - 1) * horizontalSpacing;
		const startX = -totalWidth / 2 + nodeWidth / 2;
		const level1Y = rootY + nodeHeight + verticalSpacing;

		tree.prerequisites.forEach((prereq, index) => {
			level1Nodes.push({
				code: prereq.code,
				name: prereq.name,
				status: prereq.status,
				x: startX + index * (nodeWidth + horizontalSpacing),
				y: level1Y,
				hasChildren: prereq.prerequisites && prereq.prerequisites.length > 0,
				parentIndex: index
			});
		});
		levels.push(level1Nodes);

		// Level 2: Prerequisites of prerequisites
		const level2Nodes: LayoutNode[] = [];

		tree.prerequisites.forEach((prereq, parentIndex) => {
			if (prereq.prerequisites && prereq.prerequisites.length > 0) {
				const parentX = level1Nodes[parentIndex].x;
				const childrenTotalWidth =
					prereq.prerequisites.length * nodeWidth +
					(prereq.prerequisites.length - 1) * horizontalSpacing;
				const childrenStartX = parentX - childrenTotalWidth / 2 + nodeWidth / 2;
				const level2Y = level1Y + nodeHeight + verticalSpacing;

				prereq.prerequisites.forEach((child, childIndex) => {
					level2Nodes.push({
						code: child.code,
						name: child.name,
						status: child.status,
						x: childrenStartX + childIndex * (nodeWidth + horizontalSpacing),
						y: level2Y,
						hasChildren: false,
						parentIndex
					});
				});
			}
		});

		if (level2Nodes.length > 0) {
			levels.push(level2Nodes);
		}
	}

	let minLeft = Infinity;
	let maxRight = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	levels.forEach(level => {
		level.forEach(node => {
			const left = node.x - nodeWidth / 2;
			const right = node.x + nodeWidth / 2;
			minLeft = Math.min(minLeft, left);
			maxRight = Math.max(maxRight, right);
			minY = Math.min(minY, node.y);
			maxY = Math.max(maxY, node.y + nodeHeight);
		});
	});

	if (!Number.isFinite(minLeft) || !Number.isFinite(maxRight)) {
		return {
			levels,
			width: nodeWidth + horizontalPadding * 2,
			height: nodeHeight + verticalPadding * 2
		};
	}

	const shiftX = horizontalPadding - minLeft;
	const shiftY = verticalPadding - minY;

	levels.forEach(level => {
		level.forEach(node => {
			node.x += shiftX;
			node.y += shiftY;
		});
	});

	const width = maxRight - minLeft + horizontalPadding * 2;
	const height = maxY - minY + verticalPadding * 2;

	return { levels, width, height };
}

const layout = $derived.by(() => calculateLayout());
const levels = $derived.by(() => layout.levels);
const svgWidth = $derived.by(() => layout.width);
const svgHeight = $derived.by(() => layout.height);

function getEdges(levelData: LayoutNode[][]) {
	const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

	if (!tree || !tree.prerequisites || levelData.length < 2) {
		return edges;
	}

	// Edges from root to level 1
	const root = levelData[0][0];
	if (levelData[1]) {
		levelData[1].forEach(node => {
			edges.push({
				x1: root.x,
				y1: root.y + nodeHeight,
				x2: node.x,
				y2: node.y
			});
		});
	}

	// Edges from level 1 to level 2
	if (levelData.length > 2 && tree.prerequisites && levelData[1] && levelData[2]) {
		levelData[2].forEach(childNode => {
			if (childNode.parentIndex !== undefined && levelData[1][childNode.parentIndex]) {
				const parentNode = levelData[1][childNode.parentIndex];
				edges.push({
					x1: parentNode.x,
					y1: parentNode.y + nodeHeight,
					x2: childNode.x,
					y2: childNode.y
				});
			}
		});
	}

	return edges;
}

const edges = $derived.by(() => getEdges(levels));
</script>

{#if tree && tree.prerequisites && Array.isArray(tree.prerequisites) && tree.prerequisites.length > 0}
    <div class="w-full overflow-x-auto overflow-y-hidden bg-white rounded-lg border border-gray-200 p-6 touch-pan-x">
        <div class="mx-auto" style="max-width: {svgWidth}px;">
            <svg
                class="w-full h-auto"
                viewBox="0 0 {svgWidth} {svgHeight}"
                preserveAspectRatio="xMidYMin meet"
            >
			<!-- Arrow marker definition -->
			<defs>
				<marker
					id="arrowhead"
					markerWidth="10"
					markerHeight="10"
					refX="9"
					refY="3"
					orient="auto"
				>
					<polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
				</marker>
			</defs>
			
			<!-- Draw edges first (behind nodes) -->
			<g stroke="#6b7280" stroke-width="2" fill="none">
				{#each edges as edge}
					<path
						d="M {edge.x1} {edge.y1} L {edge.x2} {edge.y2}"
						marker-end="url(#arrowhead)"
					/>
				{/each}
			</g>
			
			<!-- Draw nodes -->
			{#each levels as level}
				{#each level as node}
					<g transform="translate({node.x - nodeWidth / 2}, {node.y})">
						<!-- Node rectangle -->
						<rect
							width={nodeWidth}
							height={nodeHeight}
							rx="8"
							fill={getStatusColor(node.status as 'met' | 'partial' | 'not-met')}
							stroke="#1f2937"
							stroke-width="2"
							class="drop-shadow-lg"
						/>
						<!-- Node content -->
						<foreignObject width={nodeWidth} height={nodeHeight} x="0" y="0">
							<div class="flex flex-col items-center justify-center h-full p-2 text-white text-center">
								<div class="text-xs font-medium opacity-75 mb-1">
									{#if node.code === tree.courseCode}
										Target Course
									{:else}
										{getStatusIcon(node.status as 'met' | 'partial' | 'not-met')} Prerequisite
									{/if}
								</div>
								<div class="text-sm font-bold w-full truncate">{node.code}</div>
								<div class="text-xs mt-1 opacity-90 line-clamp-2 px-1 leading-tight">
									{node.name}
								</div>
							</div>
						</foreignObject>
					</g>
				{/each}
			{/each}
		</svg>
	</div>
	
	<!-- Legend -->
	<div class="mt-6 flex items-center justify-center gap-6 text-sm">
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 rounded bg-green-500"></div>
			<span>All prerequisites met</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 rounded bg-yellow-500"></div>
			<span>Partially met</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 rounded bg-red-500"></div>
			<span>Not met</span>
		</div>
	</div>
</div>
{/if}
