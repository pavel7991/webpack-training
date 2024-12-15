import $ from 'jquery'
import '@css/style.css'
import Post from './post'
import json from './assets/data.json'
import logo from './assets/icon-square-big.png'

const post = new Post('Webpack Post Title', logo)

console.log('Post to string:')

$('.test').html(post.toString())
console.log(json)
