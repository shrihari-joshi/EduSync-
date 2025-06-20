import React, { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Handle } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    { id: '1', data: { label: '🚀 Start: React Roadmap' }, position: { x: 0, y: 0 }, className: 'bg-indigo-700 text-white rounded-lg shadow-lg p-4' },
    { id: '2', data: { label: '📚 HTML, CSS, JS' }, position: { x: -150, y: 100 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '3', data: { label: '🎯 ES6+ Features' }, position: { x: 150, y: 100 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '4', data: { label: '📦 NPM & Package Managers' }, position: { x: 0, y: 200 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '5', data: { label: '⚛️ React Basics' }, position: { x: 0, y: 300 }, className: 'bg-indigo-600 text-white rounded-lg shadow-lg p-4' },
    { id: '6', data: { label: '🪝 React Hooks' }, position: { x: -150, y: 400 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '7', data: { label: '🚦 React Router' }, position: { x: 150, y: 400 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '8', data: { label: '🌐 API Interaction' }, position: { x: 0, y: 500 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '9', data: { label: '🧪 Testing with Jest' }, position: { x: -150, y: 600 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' },
    { id: '10', data: { label: '🚀 Advanced React' }, position: { x: 150, y: 600 }, className: 'bg-indigo-500 text-white rounded-lg shadow-lg p-4' }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#818cf8' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#818cf8' } },
    { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#818cf8' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e5-8', source: '5', target: '8', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e8-10', source: '8', target: '10', animated: true, style: { stroke: '#6366f1' } }
];

const nodeTypes = {
    custom: ({ data }) => (
        <div className='bg-indigo-500 text-white p-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-300'>
            {data.label}
        </div>
    ),
};

const ReactFlowRoadmap = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [hoveredNode, setHoveredNode] = useState(null);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className='h-screen w-full bg-indigo-100'>
            <h1 className='text-4xl text-center text-indigo-700 font-bold my-4'>React Roadmap 📚</h1>
            <div className='h-5/6 w-5/6 mx-auto rounded-lg shadow-xl overflow-hidden'>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <MiniMap
                        nodeColor={(node) => {
                            switch (node.id) {
                                case '1':
                                    return '#818cf8';
                                case '5':
                                    return '#6366f1';
                                default:
                                    return '#a5b4fc';
                            }
                        }}
                    />
                    <Controls />
                    <Background color='#e5e7eb' gap={12} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default ReactFlowRoadmap;
