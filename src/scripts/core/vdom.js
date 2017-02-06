import debug from 'debug';

const log = debug('log:');
if (ENV !== 'production') {
	debug.enable('*');
} else {
	debug.disable();
}
// 将HTML字符串格式解析成virtual DOM树
function htmlStringParser (htmlString) {
	const VdomTree = htmlString;
	
	return VdomTree;
}
// 创建Virtual DOM节点
function createVdomNode (nodeType, props = {}, ...children) {
	return { nodeType, props, children};
}
// 根据vdom tree构建真实的DOM树(RdomTree)
function createRdomTree (node) {
	// 1. 如果节点为文本节点
	if (typeof node === 'string') {
		return document.createTextNode(node);
	}
	// 2. 如果节点是元素节点
	const $elem = document.createElement(node.nodeType);

	setRdomAttrs($elem, node.props);

	node.children.map((childNode) => {
		$elem.appendChild(createRdomTree(childNode));
	});

	return $elem;
}

function updateRdom ($parent, newNode, oldNode, index = 0) {
	if (!oldNode) {
		$parent.appendChild(createRdomTree(newNode));
	}
	else if (!newNode) {
		$parent.removeChild($parent.childNodes[index]);
	}
	else if (hasChanged(newNode, oldNode)) {
		$parent.replaceChild(createRdomTree(newNode), $parent.childNodes[index]);
	}
	else if (newNode.nodeType) {
		let newLength = newNode.children.length,
			oldLength = oldNode.children.length;

		for (let i = 0; i < newLength || i < oldLength; i++) {
			updateRdom(
				$parent.childNodes[index], 
				newNode.children[i], 
				oldNode.children[i], 
				i
			);
		}

		updateAttrs(
			$parent.childNodes[index],
			newNode.props,
			oldNode.props
		);
	}
}
function hasChanged (node1, node2) {
	return (typeof node1 !== typeof node2) || 
		(typeof node1 === 'string' && node1 !== node2) ||
		(node1.nodeType !== node2.nodeType);
}

function setRdomAttr ($elem, attrName, attrVal) {
	if (isCustomAttr(attrName)) {
		return;
	} else if (attrName === 'className') {
		$elem.setAttribute('class', attrVal);
	} else if (typeof attrVal === 'boolean') {
		setBooleanAttr($elem, attrName, attrVal);
	} else {
		$elem.setAttribute(attrName, attrVal);
	}
}

function setRdomAttrs ($elem, attrs) {
	Object.keys(attrs).forEach((attrName) => {
		setRdomAttr($elem, attrName, attrs[attrName]);
	});
}

function setBooleanAttr ($elem, attrName, attrVal) {
  if (attrVal) {
    $elem.setAttribute(attrName, attrVal);
    $elem[attrName] = true;
  } else {
    $elem[attrName] = false;
  }
}
function isCustomAttr (attrName) {
	return false;
}

function removeBooleanAttr ($elem, attrName) {
	$elem.removeAttribute(attrName);
	$elem[attrName] = false;
}

function removeAttr ($elem, attrName, attrVal) {
	if (isCustomAttr(attrName)) {
		return;
	} else if (attrName === 'className') {
		$elem.removeAttribute('class');
	} else if (typeof attrVal === 'boolean') {
		removeBooleanAttr($elem, attrName);
	} else {
		$elem.removeAttribute(attrName);
	}
}

function updateAttr ($elem, attrName, newVal, oldVal) {
	if (!newVal) {
		removeAttr($elem, attrName, oldVal);
	} else if (!oldVal || newVal !== oldVal) {
		setRdomAttr($elem, attrName, newVal);
	}
}

function updateAttrs ($elem, newAttrs, oldAttrs = {}) {
	const attrs = Object.assign({}, newAttrs, oldAttrs);

	Object.keys(attrs).forEach(name => {
		updateAttr($elem, name, newAttrs[name], oldAttrs[name]);
	});
}

export {createVdomNode, createRdomTree, updateRdom};
