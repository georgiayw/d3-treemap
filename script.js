let gameDataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

let gameData

let canvas = d3.select("#canvas")

//tooltip
let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
    .style('padding', '15px');

let mouseover = function() {
    tooltip.style('opacity', 1)
    
    d3.select(this)
        .style('opacity', 1)
}

let mouseleave = function() {
    tooltip.style('opacity', 0)

    d3.select(this)
        .style('opacity', 1)
}

let drawTreeMap = () => {

    let hierarchy = d3.hierarchy(gameData, (node) => {
        //created hierarchy to tell it to process gameData as a tree
        return node['children']
        //if each node has any children it will be stored in children field
    }).sum((node) => {
        return node['value']
        //told each node's value can be determined by the value field
    }).sort((node1, node2) => {
        return node2['value'] - node1['value'] 
        //sorts nodes and puts nodes that have a higher value first
        //if it's a positive number it returns node2 will be put before node 1
        //if it's negative it returns node1 before node2
        //for whichever node it will put forward the higher number
    }) 

    let createTreeMap = d3.treemap()
        .size([1000, 600])
        /* 
            created a method (createTreeMap) which creates treemap with 
            size 1000, 600 for any hierarchy we give it 
        */

    createTreeMap(hierarchy)
    /*
        called this method with hierarchy created before 
        - sets properties on each of the leaf nodes for the coordinates
        of the coordinates of the rectangles that we can draw from it
    */

    let gameTiles = hierarchy.leaves()
    //set gameTiles to be the array of leaf nodes

    console.log(gameTiles)

    //create new group element for each array with added rect 
    let block = canvas.selectAll('g') 
        .data(gameTiles)
        .enter()
        .append('g')
        .attr('transform', (game) => {
            return 'translate(' + game['x0'] + ',' + game['y0'] + ')'
        })
        
    block.append('rect')
        .attr('class', 'tile')
        //added color to each block
        .attr('fill', (game) => {
            let category = game['data']['category']
            if(category === 'Wii'){
                return '#ccd5ae'
            } else if(category === 'GB'){
                return '#e9edc9'
            } else if(category === 'PS2'){
                return '#fefae0'
            } else if(category === 'SNES'){
                return '#faedcd'
            } else if(category === 'GBA'){
                return '#d4a373'
            } else if(category === '2600'){
                return '#dbe1bc'
            } else if(category === 'DS'){
                return '#f4f4d5'
            } else if(category === 'PS3'){
                return '#fcf4d7'
            } else if(category === '3DS'){
                return '#e7c8a0'
            } else if(category === 'PS'){
                return '#deb68a'
            } else if(category === 'XB'){
                return '#e5cdb0'
            } else if(category === 'PSP'){
                return '#f6f4d2'
            } else if(category === 'X360'){
                return '#cbdfbd'
            } else if(category === 'NES'){
                return '#c3cfa0'
            } else if(category === 'PS4'){
                return '#dec09a'
            } else if(category === 'N64'){
                return '#fff0cf'
            } else if(category === 'PC'){
                return '#d8cba8'
            } else if(category === 'XOne'){
                return '#dee7b1'
            }
        })
        .attr('data-name', (game) => {
            return game['data']['name']
        })
        .attr('data-category', (game) => {
            return game['data']['category']
        })
        .attr('data-value', (game) => {
            return game['data']['value']
        })
        .attr('width', (game) => {
            return game['x1'] - game['x0']
        })
        .attr('height', (game) => {
            return game['y1'] - game['y0']
        })
        .style('stroke', 'white')
        .on('mouseover', mouseover)
        .on('mousemove', function(game) {
            let tooltip = d3.select('#tooltip')

            let name = game['data']['name']
            let category = game['data']['category']
            let value = game['data']['value']

            tooltip
                .html('<strong>Name:</strong> ' + name 
                    + '<br><strong>Category:</strong> ' + category
                    + '<br><strong>Value:</strong> ' + value)
                .style('left', (d3.event.pageX + 10) + 'px')
                .style('top', (d3.event.pageY - 10) + 'px')
                .style('opacity', 0.9)
                .attr('data-value', d3.select(this).attr('data-value'))
        })
        .on('mouseleave', mouseleave)
        
    block.append('text')
        .attr('class', 'tile-text')
        .style('font-size', '7px')
        .selectAll('tspan')
        .data(function (d) {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', function (d, i) {
            return 10 + i * 7;
        })
        .text(function (d) {
            return d;
        });

    //legend
    let color = [
        {color: '#ccd5ae', category: 'Wii'},
        {color: '#e9edc9', category: 'GB'},
        {color: '#fefae0', category: 'PS2'},
        {color: '#faedcd', category: 'SNES'},
        {color: '#d4a373', category: 'GBA'},
        {color: '#dbe1bc', category: '2600'},
        {color: '#f4f4d5', category: 'DS'},
        {color: '#fcf4d7', category: 'PS3'},
        {color: '#e7c8a0', category: '3DS'},
        {color: '#deb68a', category: 'PS'},
        {color: '#e5cdb0', category: 'XB'},
        {color: '#f6f4d2', category: 'PSP'},
        {color: '#cbdfbd', category: 'X360'},
        {color: '#c3cfa0', category: 'NES'},
        {color: '#dec09a', category: 'PS4'},
        {color: '#fff0cf', category: 'N64'},
        {color: '#d8cba8', category: 'PC'},
        {color: '#dee7b1', category: 'XOne'}
    ]

    let legendWidth = 500;
    let legendItemWidth = 200;
    let legendHeight = Math.ceil(color.length / 3) * 30; //grid of 3

    let legend = d3.select('body') //select container legend will be in
        .append('svg') //appends an svg element to container
        .attr('id', 'legend') 
        .attr('width', legendWidth)
        .attr('height', legendHeight)

    let legendItems = legend.selectAll('g') 
    //selects all 'g' elements within legend
        .data(color) //bind color data to 'g' elements
        .enter() //enter data selection
        .append('g') //append a 'g' element for each data item
        .attr('transform', 
            (d, i) => `translate(${(i % 3) * legendItemWidth}, 
            ${Math.floor(i / 3) * 30})`)
        //position each 'g' element in a grid layout
    
    legendItems.append('rect') //append a rectangle for each legend item
        .attr('class', 'legend-item')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', d => d.color) //set fill color of rectangle based on data

    legendItems.append('text') //append text for each legend item
        .text(d => d.category) //set text content of text element based on data
        .attr('x', 30)
        .attr('y', 15)
        .style('alignment-baseline', 'middle')

}

d3.json(gameDataURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        } else {
            gameData = data
            console.log(gameData)
            
            drawTreeMap()
        }
    }
)