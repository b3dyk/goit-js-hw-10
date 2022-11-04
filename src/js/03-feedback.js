import throttle from 'lodash.throttle';

class FeedbackForm {
  constructor({ feedbackForm, email, message, STORAGE_KEY, data }) {
    this.feedbackForm = feedbackForm;
    this.email = email;
    this.message = message;
    this.STORAGE_KEY = STORAGE_KEY;
    this.data = data;
  }

  init() {
    this.checkStorage();
    this.addListeners();
  }

  addListeners() {
    this.feedbackForm.addEventListener('submit', this.onSubmit.bind(this));
    this.feedbackForm.addEventListener(
      'input',
      throttle(this.onInput.bind(this), 500)
    );
  }

  checkStorage() {
    try {
      if (localStorage.getItem(this.STORAGE_KEY)) {
        const text = JSON.parse(localStorage.getItem(this.STORAGE_KEY));

        this.email.value = `${text.email}`;
        this.message.value = `${text.message}`;
      }
    } catch (e) {
      console.log(error.name);
      console.log(error.message);
    }
  }

  onInput(evt) {
    this.data[evt.target.name] = evt.target.value;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  onSubmit(evt) {
    evt.preventDefault();

    const { email, message } = evt.target.elements;

    if (!email.value || !message.value) {
      return alert('Будь ласка, заповніть всі поля!');
    }

    console.log({ email: email.value, message: message.value });

    localStorage.removeItem(this.STORAGE_KEY);

    this.feedbackForm.reset();
  }
}

const refs = {
  feedbackForm: document.querySelector('.feedback-form'),
  email: document.querySelector('[name="email"]'),
  message: document.querySelector('[name="message"]'),
  STORAGE_KEY: 'feedback-form-state',
  data: {},
};

new FeedbackForm(refs).init();
