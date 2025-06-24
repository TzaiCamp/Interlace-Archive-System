document.addEventListener('DOMContentLoaded', function() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    // 移除 Bootstrap 的事件監聽器
    button.removeAttribute('data-bs-toggle');
    
    // 添加我們自己的點擊事件
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-bs-target');
      const targetAccordion = document.querySelector(targetId);
      const openAccordion = document.querySelector('.accordion-collapse.show');
      
      // 如果有其他抽屜開啟，且不是當前點擊的抽屜，則不做任何事
      if (openAccordion && openAccordion !== targetAccordion) {
        return false;
      }
      
      // 如果點擊的是當前開啟的抽屜，關閉它
      if (targetAccordion.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(targetAccordion, {
          toggle: false
        });
        bsCollapse.hide();
        this.classList.add('collapsed');
        this.setAttribute('aria-expanded', 'false');
        
        // 移除其他按鈕的禁用狀態
        accordionButtons.forEach(btn => {
          if (btn !== this) {
            btn.classList.remove('disabled');
          }
        });
      } else {
        // 如果沒有其他抽屜開啟，開啟這個抽屜
        const bsCollapse = new bootstrap.Collapse(targetAccordion, {
          toggle: false
        });
        bsCollapse.show();
        this.classList.remove('collapsed');
        this.setAttribute('aria-expanded', 'true');
        
        // 禁用其他按鈕
        accordionButtons.forEach(btn => {
          if (btn !== this) {
            btn.classList.add('disabled');
          }
        });
      }
    });
  });
});
