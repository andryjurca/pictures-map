
$.getJSON('/filenamelist', function (data) {
    const ulElement = document.getElementById('ul')
    console.log(data)
    filenameList = data
    for (const filename of filenameList) {
        const li = document.createElement('li')
        const filenameText = document.createTextNode(filename)
        li.appendChild(filenameText)
        ulElement.appendChild(li)

    }
})
