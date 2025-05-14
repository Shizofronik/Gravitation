//Валидация через fetch(запустить во втором терминале npx json-server db.json5)

const path = require('path');

class FormsValidation {

    selectors = {
        form: '[data-js-singin]',
    }

    constructor(){
        this.bindEvents()
    }
    
    onSubmit(event) {
        if(!event.target.closest(this.selectors.form)) {
            return
        }
        
        const formData = new FormData(event.target)
        const loginData = formData.get('login')
        const passwordData = formData.get('password')

        fetch(`http://localhost:3000/users`)
            .then((response) => {

                if(!response.ok) {
                    const errorMessage = 'Что-то пошло не так'

                    throw new Error(errorMessage)
                }

                return response.json()
            })
            .then((json) => {
                json.forEach((user) => {
                    let {username, password} = user

                    if(username === loginData) {
                        if(passwordData === password) {
                            console.log('Успех!')
                            //Изменить путь на нужный
                            window.location.assign(path.join(__dirname, 'pages', 'main.html'))
                        }

                        else {
                            console.log('Неверный пароль')
                        }
                    }
                })
            })
            .catch((error) => {
                console.log(error.message)
            })

    }

    bindEvents() {
        document.addEventListener('submit', (event) => {
            event.preventDefault()
            this.onSubmit(event)
        })
    }

}

new FormsValidation()

const regFormElement = document.querySelector('[data-js-regForm]')

//Потом убрать(как будет страничка registrtion)
regFormElement.addEventListener('submit', (event) => {
    event.preventDefault()
})