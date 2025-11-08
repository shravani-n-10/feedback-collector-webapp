const form = document.getElementById('feedbackForm');
const list = document.getElementById('feedbackList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !message) return alert('Please fill out all fields.');

  await fetch('/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message })
  });

  form.reset();
  loadFeedback();
});

async function loadFeedback() {
  const res = await fetch('/feedback');
  const feedbacks = await res.json();

  list.innerHTML = feedbacks
    .map(f => `<li><strong>${f.name}</strong>: ${f.message}</li>`)
    .join('');
}

loadFeedback();
