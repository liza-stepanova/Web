(() => {
    function calculateLoadTime() {
        performance.mark('pageEnd');
        performance.measure('pageLoad', 'navigationStart', 'pageEnd');
        const measures = performance.getEntriesByType('measure');
        const pageLoadTime = measures.find(measure => measure.name === 'pageLoad');
        return pageLoadTime.duration;
    }

    window.addEventListener('load', () => {
        const loadTime = document.createElement('div');
        loadTime.innerHTML = `Страница загрузилась за ${calculateLoadTime().toFixed(2)} мс`;
        document.querySelector('footer').appendChild(loadTime);

        const links = document.querySelectorAll('.nav-link');

        links.forEach( (link) =>{
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
        });
    });
})();