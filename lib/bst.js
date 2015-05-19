'use strict';
var assert = require('chai').assert,
    util = require('util');

var tree = {};
module.exports = tree;
var Node = function Node(value)
{
    this.value = value;
}

Node.prototype.visitPostOrder = function visitPostOrder()
{
    assert.isNumber(this.value);
    var result = [];
    if (this.left)
        result.push.apply(result, this.left.visitPostOrder());
    if (this.right)
        result.push.apply(result, this.right.visitPostOrder());
    result.push(this.value);
    return result;
}

Node.prototype.visitInOrder = function visitInOrder()
{
    assert.isNumber(this.value);
    var result = [];
    if (this.left)
        result.push.apply(result, this.left.visitInOrder());
    result.push(this.value);
    if (this.right)
        result.push.apply(result, this.right.visitInOrder());
    return result;
}

tree.createNode = function createNode(value)
{
    return new Node(value);
}

// create tree given in order and post order
tree.createTree = function createTree(inOrder, postOrder)
{
    assert.isArray(inOrder);
    assert.isArray(postOrder);
    assert(inOrder.length == postOrder.length, 'inorder and post order should have same length');
    return tree.createSubTree(inOrder, postOrder, 0, 0, inOrder.length);
}

tree.createSubTree = function createSubTree(inOrder, postOrder, inStart, postStart, size)
{
    assert.isNumber(inStart);
    assert.isNumber(postStart);
    assert.isNumber(size);
    if (size == 0)
        return undefined;
    var nodeValue = postOrder[postStart + size - 1];
    var nodeIndex = findIndex(inOrder, inStart, size, nodeValue);
    var node = tree.createNode(nodeValue);
    var left = {
        inStart: inStart,
        postStart: postStart,
        size: nodeIndex - inStart
    };
    var right = {
        inStart: nodeIndex + 1,
        postStart: postStart + left.size,
        size: size - left.size - 1,
    };
    node.left = tree.createSubTree(inOrder, postOrder, left.inStart, left.postStart, left.size);
    node.right = tree.createSubTree(inOrder, postOrder, right.inStart, right.postStart, right.size);
    if (node.left)
        node.left.parent = node;
    if (node.right)
        node.right.parent = node;
    return node;
}

function findIndex(array, start, size, value)
{
    for (var i = start; i < start + size; i++)
        if (array[i] === value)
            return i;
    throw new Error(util.format('value (%d) - not found', value));
}

Node.prototype.isBst = function isBst()
{
    return isBstImpl(this, -Infinity, Infinity);
}

function isBstImpl(node, minValue, maxValue)
{
    assert.isObject(node);
    if (!(node.value > minValue && node.value < maxValue))
        return false;
    return ((!node.left || isBstImpl(node.left, minValue, node.value)) &&
        (!node.right || isBstImpl(node.right, node.value, maxValue)));
}

// from wikipedia: The height of a node is the number of edges on the longest downward path between that node and a leaf
Node.prototype.height = function height()
{
    if (!this.left && !this.right)
        return 0;
    var leftHeight = this.left ? this.left.height() : 0;
    var rightHeight = this.right ? this.right.height() : 0;
    return Math.max(leftHeight, rightHeight) + 1;
}

// from wikipedia: The depth of a node is the number of edges from the node to the tree's root node.
Node.prototype.depth = function depth()
{
    var r = 0;
    for (var node = this.parent; !!node ; node = node.parent)
        r++;
    return r;
}

// find node with value under the node
Node.prototype.find = function find(value)
{
    if (this.value === value)
        return this;
    if (value < this.value && this.left)
        return this.left.find(value);
    else if (value > this.value && this.right)
        return this.right.find(value);
}

// find LCA - least common ancestor node for the given nodes (values) 
Node.prototype.lca = function lca(values)
{
    assert.isArray(values);
    var nodeDepth = {}, nodes = {};
    values.forEach(function (value)
    {
        nodeDepth[value] = -1;
    });
    // visit the tree to find nodes and their depth 
    visitNodes(this, 0);
    // if any node is not found in the tree - lca does not exist
    for (var key in nodeDepth)
        if (nodeDepth[key] == -1)
            return undefined;
    // get min depth among given nodes
    var minDepth = Infinity;
    for (var key in nodeDepth)
        if (nodeDepth[key] < minDepth)
            minDepth = nodeDepth[key];
    if (minDepth == 0)
        return undefined; // ancestor of root is undefined
    else if (minDepth == 1)
        return this; // root node
    else  
        minDepth--;
    
    // lca can be at depth <= minDepth - 1
    // get parents of the node at depth minDepth - 1 and then move up
    var parents = [];
    values.forEach(function (value)
    {
        var node;
        for (var depth = nodeDepth[value], node = nodes[value]; depth > minDepth; depth--)
            node = node.parent;
        parents.push(node);    
    });
    for (var depth = minDepth; depth > 0; depth--)
    {
        var found = true;
        for (var i = 0; i < parents.length - 1; i++)
            if (parents[i].value !== parents[i + 1].value)
            {
                found = false;
                break;
            }
        if (found)
            return parents[0];
        for (var i = 0; i < parents.length; i++)
            parents[i] = parents[i].parent;
    }
    return this;
    
    function visitNodes(node, depth)
    {
        if (nodeDepth[node.value] == -1)
        {
            nodeDepth[node.value] = depth;
            nodes[node.value] = node;
        }
        if (node.left)
            visitNodes(node.left, depth + 1);
        if (node.right)
            visitNodes(node.right, depth + 1);
    }
}