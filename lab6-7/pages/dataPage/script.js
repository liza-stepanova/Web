document.addEventListener('DOMContentLoaded', function () {
    const photosContainer = document.getElementById('photos');
    const preloader = document.getElementById('preloader');
    const loadPhotosButton = document.getElementById('loadPhotos');

    async function fetchPhotos(limit) {
        preloader.style.display = 'block';
        photosContainer.innerHTML = '';
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`);
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            const photos = await response.json();
            return photos;
        } catch (error) {
            toastr.error(error.message, 'Ошибка');
        } finally {
            preloader.style.display = 'none';
        }
    }

    function renderPhotos(photos) {
        photos.forEach(photo => {
            const photoElement = document.createElement('article');
            photoElement.className = 'product-card';
            photoElement.innerHTML = `
      <img class="product-card__image" src="${photo.url}" alt="${photo.title}" onerror="this.src='../../images/no_image.gif'">
      <div class="product-card__name">
          <h4>${photo.title}</h4>
          <p>Автор неизвестен</p>
      </div>
      <button class="product-card__button">Купить</button>
    `;
            photosContainer.appendChild(photoElement);
        });
    }

    loadPhotosButton.addEventListener('click', () => {
        const photoCount = document.getElementById('photoCount').value;
        if (photoCount <= 0) {
            toastr.error('Введите корректное количество фотографий', 'Ошибка');
            return;
        }
        fetchPhotos(photoCount).then(r => {
            renderPhotos(r);
            toastr.success('Фотографии успешно загружены');
        });
    });

});
