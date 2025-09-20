from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],  # Added 5173 for Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline_data: PipelineData):
    """
    Analyze the pipeline and return:
    - Number of nodes
    - Number of edges  
    - Whether it forms a DAG (Directed Acyclic Graph)
    """
    
    nodes = pipeline_data.nodes
    edges = pipeline_data.edges
    
    # Count nodes and edges
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the graph is a DAG
    is_dag = check_is_dag(nodes, edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph forms a Directed Acyclic Graph (DAG)
    Uses Kahn's algorithm (topological sorting) to detect cycles
    """
    
    if not nodes:
        return True  # Empty graph is a DAG
    
    # Build adjacency list and in-degree count
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Initialize all nodes with in-degree 0
    for node in nodes:
        in_degree[node.id] = 0
    
    # Build the graph from edges
    for edge in edges:
        source = edge.source
        target = edge.target
        
        graph[source].append(target)
        in_degree[target] += 1
    
    # Kahn's algorithm for topological sorting
    # If we can sort all nodes, it's a DAG
    queue = deque()
    
    # Start with nodes that have no incoming edges
    for node_id in in_degree:
        if in_degree[node_id] == 0:
            queue.append(node_id)
    
    processed_count = 0
    
    while queue:
        current = queue.popleft()
        processed_count += 1
        
        # Remove edges from current node
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG
    # If not, there's a cycle
    return processed_count == len(nodes)

# Health check endpoint
@app.get('/health')
def health_check():
    return {"status": "healthy", "message": "Backend is running correctly"}

# Debug endpoint to test the DAG checker
@app.get('/test-dag')
def test_dag():
    """Test endpoint with sample data"""
    
    # Test case 1: Valid DAG
    test_nodes = [
        Node(id="1", type="input"),
        Node(id="2", type="process"), 
        Node(id="3", type="output")
    ]
    test_edges = [
        Edge(id="e1", source="1", target="2"),
        Edge(id="e2", source="2", target="3")
    ]
    
    is_dag = check_is_dag(test_nodes, test_edges)
    
    return {
        "test_case": "Linear pipeline",
        "nodes": len(test_nodes),
        "edges": len(test_edges), 
        "is_dag": is_dag,
        "expected": True
    }