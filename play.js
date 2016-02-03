var game;

function start( game ){
	this.game = game;
	
}

function fetchMessagesForNode(nodeId){
	try{
		return this.game.nodes[nodeId-1].textLines;
	}catch(err){
		throw 'Looks like you didn\'t call the \'start\' method first.';

	}
}

function fetchOptions(nodeId){
	return this.game.nodes[nodeId-1].choices;
}

module.exports = {
	start : start,
	fetchMessagesForNode : fetchMessagesForNode,
	fetchOptions : fetchOptions
}