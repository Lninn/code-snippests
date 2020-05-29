var log = console.log.bind(console)
var e = sel => document.querySelector(sel)

const validateEmail = email => {
    const re = /^[a-z0-9\.\-\_]+\@[a-z0-9\-\_]+(\.[a-z0-9\-\_]+){1,4}$/

    return re.test(email.toLowerCase())
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
