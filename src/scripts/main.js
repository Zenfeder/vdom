import {createVdomNode, createRdomTree, updateRdom} from './core/vdom';

import debug from 'debug';
const log = debug('log:');

// 仅在非production模式下启用debug
if (ENV !== 'production') {
  // 启用debug功能
	debug.enable('*');
	log('debug功能已启用!');
} else {
	debug.disable();
}

const vdom_a = createVdomNode('ul', { 'className': 'list'}, 
	createVdomNode('li', {'className': 'active', 'style': 'color: green;'}, 'Facebook'),
	createVdomNode('li', {}, 'Uber'),
	createVdomNode('li', {}, 'Google'),
);

const vdom_b = createVdomNode('ul', { 'className': 'list'}, 
	createVdomNode('li', {}, 'Facebook'),
	createVdomNode('li', {'className': 'active', 'style': 'color: green;'}, 'Space X'),
	createVdomNode('li', {}, 
		createVdomNode('span', {}, 'Google')
	),
);

const $root = document.getElementById('root');
const $reload = document.getElementById('reload');

updateRdom($root, vdom_a);

$reload.addEventListener('click', () => {
  updateRdom($root, vdom_b, vdom_a);
});

log("hello");
