const axios = require('axios')
const {isEmpty, map, forOwn} = require('lodash');


const BASE_URL = "https://nodes-on-nodes-challenge.herokuapp.com/nodes/"
const STARTING_NODE_ID = '089ef556-dfff-4ff2-9733-654645be56fe'

const calculateNodeUrl = (nodeId) => {
	return BASE_URL + nodeId
}

//### Fetch all unique nodes
// This uses a iterative DFS approach (queue) first in => first out
// The runtime wil be O(n) where n = total number of unique ids
// The fetching will be in series aka one after another
const fetchAllUniqueNodes = async (startingNodeId) => {
	const queue = [startingNodeId]
	const visitedNodes = {[startingNodeId]: 1}
	let currNodeId

	while(!isEmpty(queue)) {
		currNodeId = queue.pop()

		const {data} = await axios.get(calculateNodeUrl(currNodeId))
		const {id, child_node_ids} = data[0]


		map(child_node_ids, (childNode)=>{
			if(visitedNodes[childNode]) {
				//we have seen this one, increment the count; stop traversal
				visitedNodes[childNode]++
			} else {
				//add the value to the queue so we will travse it
				visitedNodes[childNode] = 1
				//add the value to the list of visited nodes
				queue.push(childNode)
			}
		})
	}
	return visitedNodes
}

const calculateAnswersFromVisitedNodes = (visitedNodes) => {
	const uniqueKeys = Object.keys(visitedNodes)
	const mostCommonNodeId = uniqueKeys.reduce((a, b) => visitedNodes[a] > visitedNodes[b] ? a : b);

	//1. **What is the total number of unique node IDs?**
	console.log(uniqueKeys.length)

	//2. **What is the most common node ID?**
	console.log(mostCommonNodeId)
}

const traverseAllNodes = async (nodeId) => {
	const visitedNodes = await fetchAllUniqueNodes(nodeId)
	calculateAnswersFromVisitedNodes(visitedNodes)
}

traverseAllNodes(STARTING_NODE_ID)
