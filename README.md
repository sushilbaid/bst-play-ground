# BST Playground
BST Playground module can be used to try out BST algorithms.

## Installation
```sh
$ npm install bst-playground
```

## Version
0.3.0

## Functions
* createNode(value)
* createTree(inOrder, postOrder)
* class Node
 * depth()
 * find(value)
 * height()
 * isBst()
 * visitInOrder()
 * visitPostOrder()

#### createNode(value)
returns a node with the given value. value is number type.

#### createTree(inOrder, postOrder)
creates tree with the given inOrder and postOrder traversals - both arrays.
return the root node of the tree.

### class Node
#### depth()
returns depth of a node. 

#### find(value)
finds & returns node with value. otherwise, undefined.

#### isBst()
returns true if the subtree at this node is BST. otherwise, false.

#### height()
returns height of a node. 

#### visitInOrder()
visits tree in in order and returns the values in an array.

#### visitPostOrder()
visits tree in post order and returns the values in an array.

License
-------
MIT
