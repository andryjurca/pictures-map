// filenamelist is updated from the server

$.getJSON('/cloudimagelist', function ( data ) {
    console.log('m-am cacat')
    const ulElement = document.getElementById('ul')
    //console.log(data)
    filenameList = data
    for (const filename of filenameList) {
        const li = document.createElement('li')
        const filenameText = document.createTextNode(filename)
        li.appendChild(filenameText)
        ulElement.appendChild(li)

    }
})

const myWidget = cloudinary.createUploadWidget({
    cloudName: 'hzyfr8ajt', uploadPreset: 'test-preset'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info); 
      }
    }
  )
  
  document.getElementById("upload_widget").addEventListener("click", function(){
      myWidget.open();
    }, false);