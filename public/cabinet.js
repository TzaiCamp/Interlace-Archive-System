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
  
  // Disk 插入/退出功能
  function insertDisk(drawerId, diskId, side) {
    const slot = document.querySelector(`#diskSlot${drawerId}`);
    const slotEmpty = slot.querySelector('.slot-empty');
    const slotOccupied = slot.querySelector('.slot-occupied');
    const dataDisplay = document.querySelector(`#dataDisplay${drawerId}`);
    
    // 隱藏空插槽，顯示已插入狀態
    slotEmpty.style.display = 'none';
    slotOccupied.style.display = 'block';
    
    // 更新插入的 disk 資訊
    const diskIcon = slotOccupied.querySelector('.current-disk-icon');
    const diskInfo = slotOccupied.querySelector('.current-disk-info');
    
    if (side === 'A') {
      diskIcon.textContent = '💿';
      diskInfo.textContent = `Disk ${diskId} (A面朝上)`;
      slotOccupied.querySelector('.inserted-disk').style.borderColor = '#4CAF50';
      slotOccupied.querySelector('.inserted-disk').style.backgroundColor = '#2a5f3a';
    } else {
      diskIcon.textContent = '💽';
      diskInfo.textContent = `Disk ${diskId} (B面朝上)`;
      slotOccupied.querySelector('.inserted-disk').style.borderColor = '#FF9800';
      slotOccupied.querySelector('.inserted-disk').style.backgroundColor = '#5f3a2a';
    }
    
    // 根據正反面顯示不同資料
    displayDiskData(drawerId, diskId, side, dataDisplay);
  }

  function ejectDisk(drawerId) {
    const slot = document.querySelector(`#diskSlot${drawerId}`);
    const slotEmpty = slot.querySelector('.slot-empty');
    const slotOccupied = slot.querySelector('.slot-occupied');
    const dataDisplay = document.querySelector(`#dataDisplay${drawerId}`);
    
    // 顯示空插槽，隱藏已插入狀態
    slotEmpty.style.display = 'block';
    slotOccupied.style.display = 'none';
    
    // 清空資料顯示
    dataDisplay.innerHTML = '<div class="no-data">請插入 Disk 以讀取資料...</div>';
  }

  function displayDiskData(drawerId, diskId, side, dataDisplay) {
    // 模擬不同 disk 正反面的資料
    const diskData = {
      '1': {
        'A': `
          <div class="data-content">
            <h4>🔍 檔案系統 A</h4>
            <p>日期: 2045.03.15</p>
            <p>實驗代號: IAS-001</p>
            <p>狀態: 初始化完成</p>
            <p>備註: 時間錨點已設定</p>
            <p>紅指針: 位置 ${drawerId - 1}</p>
          </div>
        `,
        'B': `
          <div class="data-content">
            <h4>⚠️ 隱藏分區 B</h4>
            <p>日期: 2045.03.16</p>
            <p>警告: 時間異常檢測</p>
            <p>錯誤代碼: TL_PARADOX_001</p>
            <p>建議: 立即停止實驗</p>
            <p>紅指針: 異常偏移 +${Math.floor(Math.random() * 3) + 1}</p>
          </div>
        `
      }
    };
    
    const content = diskData[diskId]?.[side] || '<div class="no-data">無法讀取資料</div>';
    dataDisplay.innerHTML = content;
  }
    // 使用事件委派處理所有按鈕點擊
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('flip-btn')) {
      const drawerId = e.target.getAttribute('data-drawer');
      flipDisk(drawerId);
    }
  });

  // 拖曳功能
  // 拖曳開始
  document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('physical-disk')) {
      e.target.classList.add('dragging');
      e.dataTransfer.setData('text/plain', '');
    }
  });

  // 拖曳結束
  document.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('physical-disk')) {
      e.target.classList.remove('dragging');
    }
  });

  // 拖曳進入讀卡機
  document.addEventListener('dragover', function(e) {
    if (e.target.closest('.card-reader')) {
      e.preventDefault();
      e.target.closest('.card-reader').classList.add('drag-over');
    }
  });
  // 拖曳離開讀卡機
  document.addEventListener('dragleave', function(e) {
    if (e.target.closest('.card-reader')) {
      e.target.closest('.card-reader').classList.remove('drag-over');
    }
  });

  // 放入讀卡機
  document.addEventListener('drop', function(e) {
    const reader = e.target.closest('.card-reader');
    if (reader) {
      e.preventDefault();
      reader.classList.remove('drag-over');
      
      // 找到被拖曳的 disk
      const draggedDisk = document.querySelector('.physical-disk.dragging');
      if (draggedDisk) {
        const drawerId = reader.getAttribute('data-drawer');
        const currentSide = getCurrentDiskSide(draggedDisk);
        
        insertDiskToReader(drawerId, '1', currentSide, reader, draggedDisk);
      }
    }
  });
  
  // 獲取 Disk 當前顯示的面
  function getCurrentDiskSide(diskElement) {
    const faceA = diskElement.querySelector('.disk-face-a');
    const faceB = diskElement.querySelector('.disk-face-b');
    
    // 檢查 B 面是否隱藏（初始狀態 B 面是隱藏的）
    if (faceB.style.display === 'none' || !faceB.style.display) {
      return faceA.getAttribute('data-side');
    } else {
      return faceB.getAttribute('data-side');
    }
  }

  // Disk 翻轉功能
  function flipDisk(drawerId) {
    const diskElement = document.querySelector(`#collapse${drawerId} .physical-disk`);
    const faceA = diskElement.querySelector('.disk-face-a');
    const faceB = diskElement.querySelector('.disk-face-b');
    
    // 翻轉動畫
    diskElement.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
      if (faceA.style.display !== 'none') {
        faceA.style.display = 'none';
        faceB.style.display = 'flex';
      } else {
        faceA.style.display = 'flex';
        faceB.style.display = 'none';
      }
      diskElement.style.transform = 'rotateY(0deg)';
    }, 150);
  }

  function insertDiskToReader(drawerId, diskId, side, reader, diskElement) {
    // 隱藏原始 disk
    diskElement.style.display = 'none';
    
    // 更新讀卡機狀態
    reader.classList.add('disk-inserted');
    reader.querySelector('.power-light').classList.add('active');
    reader.querySelector('.reader-status').textContent = `Disk ${diskId} (${side}面)`;
    
    // 顯示資料
    const dataDisplay = document.querySelector(`#dataDisplay${drawerId}`);
    displayDiskData(drawerId, diskId, side, dataDisplay);
    
    // 添加退出按鈕
    if (!reader.querySelector('.eject-btn')) {
      const ejectBtn = document.createElement('button');
      ejectBtn.className = 'eject-btn';
      ejectBtn.textContent = '⏏️';
      ejectBtn.onclick = () => ejectDiskFromReader(drawerId, reader, diskElement);
      reader.appendChild(ejectBtn);
    }
  }

  function ejectDiskFromReader(drawerId, reader, diskElement) {
    // 恢復讀卡機狀態
    reader.classList.remove('disk-inserted');
    reader.querySelector('.power-light').classList.remove('active');
    reader.querySelector('.reader-status').textContent = '待機中...';
    
    // 移除退出按鈕
    const ejectBtn = reader.querySelector('.eject-btn');
    if (ejectBtn) ejectBtn.remove();
    
    // 顯示原始 disk
    diskElement.style.display = 'block';
    
    // 清空資料顯示
    const dataDisplay = document.querySelector(`#dataDisplay${drawerId}`);
    dataDisplay.innerHTML = '<div class="no-data">讀卡機待機中...</div>';
  }
});
