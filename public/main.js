const update = document.querySelector("#update-button")
const messageDiv = document.querySelector("#message")
const deleteQuote = document.querySelector("#delete-button")

update.addEventListener("click", ()=> {
    fetch("/quotes", {
        method: "put",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({
            name: "darth vader",
            quote: "your lack of faith is disturbing"   
        })
    })
    .then(res=> {
        if(res.ok) return res.json()
    })
    .then(response=> {
        // console.log(response)
        window.location.reload(true)
    })
})

deleteQuote.addEventListener("click", ()=> {
    fetch("/quotes", {
        method: "delete",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({
            name: "darth vader",
            // quote: "your lack of faith is disturbing"   
        })
    })

    .then(res=> {
        if(res.ok) return res.json()
    })
    .then(response=> {
        // console.log(response)
        if (response === 'No quote to delete') {
            // document.querySelector("#message").textContent = 'No Darth Vader quote to delete'
            // same as
            messageDiv.textContent = 'No Darth Vader quote to delete'
        } else {
            window.location.reload(true)
        }
    })
})