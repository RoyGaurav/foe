document.getElementById('menu-toggle').addEventListener('click',(e)=>{
    e.preventDefault();
    let wrapper = document.getElementById('wrapper');
    if(wrapper.classList.contains('menuDisplayed')) {
        wrapper.classList.remove('menuDisplayed');
    } else {
        wrapper.classList.add('menuDisplayed');
    }
});
