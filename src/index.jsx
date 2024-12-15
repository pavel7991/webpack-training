import $ from 'jquery'

import './model/lodash'
import Post from './post'
import json from './assets/data.json'
import logo from './assets/icon-square-big.png'
import React from 'react'
import { createRoot } from 'react-dom/client'

import '@css/style.css'
import '@less/style.less'
import '@scss/style.scss'

const post = new Post('Webpack Post Title', logo)

console.log('Post to string:')

$('.test').html(post.toString())

const container = document.getElementById('root')
const root = createRoot(container)

const App = () => (
  <div className="container">
    <h1>Webpack training !!!</h1>

    <h2>Hello from React!</h2>

    <div className="logo"></div>
    <pre className="test" />

    <div className="less-test">
      <h2>Less Test</h2>
    </div>

    <div className="scss-test">
      <h2>Scss Test</h2>
    </div>
  </div>
)

root.render(<App />)
