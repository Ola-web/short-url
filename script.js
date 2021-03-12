const navToggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('.nav')

const inputUrl = document.querySelector('.short-url__input').value

navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav--visible')
})

// sticky scroll
window.onscroll = function () { myScrollDown() }

const header = document.querySelector('.header')
const sticky = header.offsetTop;

function myScrollDown() {
    if (window.pageYOffset >= sticky) {
        header.classList.add('sticky')
    } else {
        header.classList.remove('sticky')
    }
}

// active state navbar
const navItem = document.getElementById("nav__item");
const navList = document.getElementsByClassName("nav__link")

for (let i = 0; i < navList.length; i++) {
    navList[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("active")
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active"
    })
}

// get element
const form = document.querySelector('form')
const inputField = document.querySelector('.short-url__input')
const field = document.querySelector('.field')
let links;

// form validation
form.addEventListener('submit', (e) => {
    const errMsg = document.createElement('p')
    e.preventDefault();
    if (inputField.value === '') {

        inputField.className = "short-url__input empty"
        errMsg.innerHTML = 'Please add a link'
        errMsg.classList.add('error')
        if (field.children.length === 2) {
            return
        } else {
            field.appendChild(errMsg)
            setTimeout(() => {
                errMsg.remove();
                inputField.className = "short-url__input"
            }, 3000)
        }
    } else {
        // if input is not empty (some in the input)

        inputField.disabled = true
        fetchUrl(errMsg)
    }
})

// clear error and type url
inputField.addEventListener('keyup', () => {
    inputField.className = "short-url__input"
    if (field.children.length === 2) {
        field.children[1].remove()
    } else {
        return;
    }
})

// fetch shortUrl
const urlContainer = document.querySelector('.short-url-container')

const fetchUrl = async (errMsg) => {
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputField.value}`)
    const data = await response.json()
    console.log(data)
    try {
        if (!data.ok) {
            inputField.disabled = false
            inputField.value = ""
            errMsg.innerText = 'Please enter a valid link'
            errMsg.classList.add('error')
            field.appendChild(errMsg)
            setTimeout(() => {
                errMsg.remove()
            }, 3000)
        } else {
            inputField.disabled = false
            inputField.value = '';
            const card = document.createElement('div')

            card.innerHTML = `
            <div class="left-url">
                <p class="main-url"><a href="${data.result.original_link}" class="card__link" target="_blank">${data.result.original_link}</a></p>
            </div>

            <div class="short-url-line"></div>

            <div class="right-url">
                <p class="short-url"><a href="${data.result.full_short_link}" class="card__link" target="_blank">${data.result.full_short_link}</a></p>
                <button class="copy-btn cyan-fill">Copy</button>
            </div>
          `
            card.className = "short-url-result"
            urlContainer.appendChild(card)

            if (localStorage.getItem('links') === null) {
                links = []
            } else {
                links = JSON.parse(localStorage.getItem('links'))
            }
            links.push(data.result.code)
            localStorage.setItem('links', JSON.stringify(links))
        }
    } catch (err) {
        console.log(err)
    }
}
// copy short url to clipboard
urlContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        e.target.classList.add("copied")
        e.target.innerText = "copied!"
    }
    setTimeout(() => {
        e.target.classList.remove('copied')
    }, 10000)



    const hidden = document.querySelector('.hidden')
    const shortUrl = e.target.previousElementSibling.children[0].innerText
    hidden.value = shortUrl
    hidden.select()
    document.execCommand('copy')
})

// getting locally stored links to  display on our UI
const loadingLinks = async (links) => {
    links.forEach(async (link) => {
        const res = await fetch(`https://api.shrtco.de/v2/info?code=${link}`)
        const data = await res.json()

        console.log(data)

        try {
            const card = document.createElement('div')
            card.innerHTML = `
            <div class="left-url">
                <p class="main-url"><a href="${data.result.url}" class="card__link" target="_blank">${data.result.url}</a></p>
            </div>

            <div class="short-url-line"></div>

            <div class="right-url">
                <p class="short-url"><a href="https://shrtco.de/${data.result.code}" class="card__link" target="_blank">https://shrtco.de/${data.result.code}</a></p>
                <button class="copy-btn cyan-fill">Copy</button>
            </div>
            `
            card.className = "short-url-result"
            urlContainer.appendChild(card)
        } catch (err) { console.log(err) }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('links') === null) {
        links = []
    } else {
        links = JSON.parse(localStorage.getItem('links'))
    }
    loadingLinks(links)
    localStorage.setItem('links', JSON.stringify(links))
})

