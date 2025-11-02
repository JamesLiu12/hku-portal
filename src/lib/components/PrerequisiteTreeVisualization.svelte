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
	const verticalSpacing = 100;
	
	function calculateLayout() {
		const levels: Array<Array<{ code: string; name: string; status: string; x: number; y: number; hasChildren: boolean }>> = [];
		
		if (!tree || !tree.prerequisites || tree.prerequisites.length === 0) {
			return levels;
		}
		
		// Level 0: Root node
		levels.push([{
			code: tree.courseCode,
			name: tree.courseName,
			status: tree.status,
			x: 600,
			y: 50,
			hasChildren: tree.prerequisites && tree.prerequisites.length > 0
		}]);
		
		// Level 1: Direct prerequisites
		if (tree.prerequisites && tree.prerequisites.length > 0) {
			const level1Nodes = [];
			const totalWidth = tree.prerequisites.length * nodeWidth + (tree.prerequisites.length - 1) * horizontalSpacing;
			const startX = 600 - totalWidth / 2 + nodeWidth / 2;
			
			tree.prerequisites.forEach((prereq, index) => {
				level1Nodes.push({
					code: prereq.code,
					name: prereq.name,
					status: prereq.status,
					x: startX + index * (nodeWidth + horizontalSpacing),
					y: 200,
					hasChildren: prereq.prerequisites && prereq.prerequisites.length > 0
				});
			});
			levels.push(level1Nodes);
			
			// Level 2: Prerequisites of prerequisites
			const level2Nodes: Array<{ code: string; name: string; status: string; x: number; y: number; hasChildren: boolean; parentIndex: number }> = [];
			
			tree.prerequisites.forEach((prereq, parentIndex) => {
				if (prereq.prerequisites && prereq.prerequisites.length > 0) {
					const parentX = level1Nodes[parentIndex].x;
					const childrenTotalWidth = prereq.prerequisites.length * nodeWidth + (prereq.prerequisites.length - 1) * horizontalSpacing;
					const childrenStartX = parentX - childrenTotalWidth / 2 + nodeWidth / 2;
					
					prereq.prerequisites.forEach((child, childIndex) => {
						level2Nodes.push({
							code: child.code,
							name: child.name,
							status: child.status,
							x: childrenStartX + childIndex * (nodeWidth + horizontalSpacing),
							y: 350,
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
		
		return levels;
	}
	
	const levels = $derived.by(() => calculateLayout());
	const maxY = $derived.by(() => {
		if (levels.length === 0) return 200;
		const allYs = levels.flatMap(l => l.map(n => n.y));
		if (allYs.length === 0) return 200;
		return Math.max(...allYs) + nodeHeight + 50;
	});
	const svgWidth = 1200;
	const svgHeight = maxY;
	
	function getEdges() {
		const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
		
		if (!tree || !tree.prerequisites || levels.length < 2) {
			return edges;
		}
		
		// Edges from root to level 1
		const root = levels[0][0];
		if (levels[1]) {
			levels[1].forEach(node => {
				edges.push({
					x1: root.x,
					y1: root.y + nodeHeight,
					x2: node.x,
					y2: node.y
				});
			});
		}
		
		// Edges from level 1 to level 2
		if (levels.length > 2 && tree.prerequisites && levels[1] && levels[2]) {
			levels[2].forEach((childNode: typeof levels[2][0] & { parentIndex?: number }) => {
				if (childNode.parentIndex !== undefined && levels[1][childNode.parentIndex]) {
					const parentNode = levels[1][childNode.parentIndex];
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
	
	const edges = $derived.by(() => getEdges());
</script>

{#if tree && tree.prerequisites && Array.isArray(tree.prerequisites) && tree.prerequisites.length > 0}
	<div class="w-full overflow-auto bg-white rounded-lg border border-gray-200 p-6">
		<div class="min-w-full" style="min-width: {svgWidth}px;">
			<svg width={svgWidth} height={svgHeight} viewBox="0 0 {svgWidth} {svgHeight}" class="w-full">
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
