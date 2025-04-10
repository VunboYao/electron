const information = document.getElementById('info')
const func = async () => {
    const response = await window.versions.ping()
    information.innerText = response
}

func()