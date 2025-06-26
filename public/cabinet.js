document.addEventListener('DOMContentLoaded', function() {
  // 羅馬數字陣列
  const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  // 初始化指針值
  let redPointerValue = 1;
  let bluePointerValue = 12;
  
  // Debug 模式 - 設為 true 時關閉紅指針限制
  const DEBUG_MODE = false; // 發布時改為 false
  
  // 檢查抽屜是否可以開啟
  function isDrawerAccessible(drawerNumber) {
    // Debug 模式下所有抽屜都可開啟
    if (DEBUG_MODE) {
      console.log(`Debug模式：允許開啟抽屜 ${drawerNumber}`);
      return true;
    }
    
    // 1號和3號抽屜永遠可開啟
    if (drawerNumber === 1 || drawerNumber === 3) {
      return true;
    }
    
    // 紅指針指向的抽屜可開啟
    if (drawerNumber === redPointerValue) {
      return true;
    }
    
    return false;
  }  // 更新抽屜可用狀態
  function updateDrawerAvailability() {
    const buttons = document.querySelectorAll('.accordion-button');
    const openAccordion = document.querySelector('.accordion-collapse.show');
    
    buttons.forEach((button, index) => {
      const drawerNumber = index + 1; // 抽屜編號從1開始
      const isAccessible = isDrawerAccessible(drawerNumber);
      const targetId = button.getAttribute('data-bs-target');
      const targetAccordion = document.querySelector(targetId);
      const isCurrentlyOpen = targetAccordion && targetAccordion.classList.contains('show');
      
      if (isAccessible || isCurrentlyOpen) {
        // 可訪問的抽屜或已經開啟的抽屜，移除受限制樣式
        button.classList.remove('restricted');
        button.removeAttribute('disabled');
        
        // 如果有其他抽屜開啟，且不是這個按鈕對應的抽屜，則仍要禁用
        if (openAccordion && !isCurrentlyOpen) {
          button.classList.add('disabled');
        } else {
          button.classList.remove('disabled');
        }
      } else {
        // 不可訪問且未開啟的抽屜，設為受限制
        button.classList.add('restricted');
        button.setAttribute('disabled', 'true');
      }
    });
  }

  // 顯示訪問被拒絕的訊息
  function showAccessDeniedMessage(drawerNumber) {
    const message = document.createElement('div');
    message.textContent = `🔒 需要紅指針指向抽屜 ${romanNumerals[drawerNumber]} 才能開啟（當前: ${romanNumerals[redPointerValue]}）`;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4757;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-weight: bold;
      text-align: center;
      min-width: 300px;
    `;
    
    document.body.appendChild(message);
    
    // 淡入效果
    message.style.opacity = '0';
    message.style.transform = 'translate(-50%, -50%) scale(0.8)';
    setTimeout(() => {
      message.style.transition = 'all 0.3s ease';
      message.style.opacity = '1';
      message.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // 2秒後淡出並移除
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 300);
    }, 2000);
  }

  function updatePointers() {
    document.getElementById('redPointer').textContent = romanNumerals[redPointerValue];
    document.getElementById('bluePointer').textContent = romanNumerals[bluePointerValue];
  }

  // 隨機指針按鈕
  document.getElementById('randomPointers').addEventListener('click', function() {
    redPointerValue = Math.floor(Math.random() * 12) + 1;
    // 藍指針保持手動設定的值，不隨機更改
    updatePointers();
    updateDrawerAvailability(); // 更新抽屜可用狀態
    
    // 添加動畫效果
    const redPointer = document.getElementById('redPointer');
    
    redPointer.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
      redPointer.style.transform = 'scale(1)';
    }, 200);
  });

  // 重置指針按鈕
  document.getElementById('resetPointers').addEventListener('click', function() {
    redPointerValue = 1;
    bluePointerValue = 12;
    updatePointers();
    updateDrawerAvailability(); // 更新抽屜可用狀態
  });

  // 更新時鐘顯示
  function updateClockDisplay() {
    // 更新指針角度：數字1在1點位置(30度)，數字12在12點位置(0度)
    let angle;
    if (bluePointerValue === 12) {
      angle = 0; // 12點位置
    } else {
      angle = bluePointerValue * 30; // 1~11點位置
    }
    clockHand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    
    // 更新選中狀態
    clockNumbers.forEach(function(clockNumber) {
      const value = parseInt(clockNumber.getAttribute('data-value'));
      if (value === bluePointerValue) {
        clockNumber.classList.add('selected');
      } else {
        clockNumber.classList.remove('selected');
      }
    });
  }

  // 藍指針彈窗控制
  const bluePointerElement = document.getElementById('bluePointer');
  const pointerControl = document.querySelector('.pointer-control');
  const popup = document.getElementById('bluePointerPopup');
  const closePopup = document.getElementById('closePopup');
  const clockHand = document.getElementById('clockHand');
  const clockNumbers = document.querySelectorAll('.clock-number');

  // 點擊時鐘圖示顯示彈窗
  pointerControl.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.classList.add('show');
    updateClockDisplay();
  });

  // 點擊藍指針值也可以顯示彈窗
  bluePointerElement.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.classList.add('show');
    updateClockDisplay();
  });

  // 關閉彈窗
  closePopup.addEventListener('click', function() {
    popup.classList.remove('show');
  });

  // 點擊彈窗背景關閉
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.classList.remove('show');
    }
  });

  // ESC 鍵關閉彈窗
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('show')) {
      popup.classList.remove('show');
    }
  });

  // 時鐘數字點擊事件
  clockNumbers.forEach(function(clockNumber) {
    clockNumber.addEventListener('click', function() {
      const value = parseInt(this.getAttribute('data-value'));
      bluePointerValue = value;
      updatePointers();
      updateClockDisplay();
      
      // 添加選中效果
      clockNumbers.forEach(num => num.classList.remove('selected'));
      this.classList.add('selected');
      
      // 0.5 秒後自動關閉彈窗
      setTimeout(() => {
        popup.classList.remove('show');
      }, 500);
    });
  });
    // 初始化顯示
  updatePointers();
  updateDrawerAvailability(); // 初始化抽屜可用狀態

  const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
    // 移除 Bootstrap 的事件監聽器
    button.removeAttribute('data-bs-toggle');
      // 添加我們自己的點擊事件
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 取得抽屜編號
      const targetId = this.getAttribute('data-bs-target');
      const drawerNumber = parseInt(targetId.replace('#collapse', ''));
      const targetAccordion = document.querySelector(targetId);
      
      // 如果這個抽屜已經開啟，允許關閉（不管是否受限制）
      if (targetAccordion.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(targetAccordion, {
          toggle: false
        });
        bsCollapse.hide();
        this.classList.add('collapsed');
        this.setAttribute('aria-expanded', 'false');
        // 移除其他按鈕的禁用狀態
        updateDrawerAvailability(); // 重新計算所有抽屜的可用狀態
        return;
      }
      
      // 檢查抽屜是否可以開啟（只對關閉的抽屜檢查）
      if (!isDrawerAccessible(drawerNumber)) {
        showAccessDeniedMessage(drawerNumber);
        return false;
      }
      
      const openAccordion = document.querySelector('.accordion-collapse.show');
      
      // 如果有其他抽屜開啟，且不是當前點擊的抽屜，則不做任何事
      if (openAccordion && openAccordion !== targetAccordion) {
        return false;
      }
      
      // 開啟這個抽屜
      const bsCollapse = new bootstrap.Collapse(targetAccordion, {
        toggle: false
      });
      bsCollapse.show();
      this.classList.remove('collapsed');
      this.setAttribute('aria-expanded', 'true');
      // 禁用其他按鈕（開啟抽屜時，所有其他抽屜都要禁用）
      const allButtons = document.querySelectorAll('.accordion-button');
      allButtons.forEach(btn => {
        if (btn !== this) {
          btn.classList.add('disabled');
        }
      });
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
    // 為每片 disk 提供簡短假資料
    const diskData = {
      '1': { 'A': 'Level-1 Data | Status: OK | Code: A001', 'B': 'Level-1 Backup | Status: Secure | Code: B001' },
      '2': { 'A': 'Level-2 Data | Status: Active | Code: A002', 'B': 'Level-2 Backup | Status: Encrypted | Code: B002' },
      '3': { 'A': 'Level-3 Data | Status: Online | Code: A003', 'B': 'Level-3 Backup | Status: Protected | Code: B003' },
      '4': { 'A': 'Level-4 Data | Status: Ready | Code: A004', 'B': 'Level-4 Backup | Status: Locked | Code: B004' },
      '5': { 'A': 'Level-5 Data | Status: Sync | Code: A005', 'B': 'Level-5 Backup | Status: Archive | Code: B005' },
      '6': { 'A': 'Level-6 Data | Status: Live | Code: A006', 'B': 'Level-6 Backup | Status: Mirror | Code: B006' },
      '7': { 'A': 'Level-7 Data | Status: Prime | Code: A007', 'B': 'Level-7 Backup | Status: Clone | Code: B007' },
      '8': { 'A': 'Level-8 Data | Status: Core | Code: A008', 'B': 'Level-8 Backup | Status: Shadow | Code: B008' },
      '9': { 'A': 'Level-9 Data | Status: Max | Code: A009', 'B': 'Level-9 Backup | Status: Hidden | Code: B009' },
      '10': { 'A': 'Level-10 Data | Status: Ultra | Code: A010', 'B': 'Level-10 Backup | Status: Deep | Code: B010' },
      '11': { 'A': 'Level-11 Data | Status: Final | Code: A011', 'B': 'Level-11 Backup | Status: Master | Code: B011' },
      '12': { 'A': 'Level-12 Data | Status: Apex | Code: A012', 'B': 'Level-12 Backup | Status: Supreme | Code: B012' }
    };
    
    const content = diskData[diskId]?.[side] || '無法讀取資料';
    dataDisplay.innerHTML = `<div class="data-content"><h4>💾 Disk ${diskId} - 面 ${side}</h4><p>${content}</p></div>`;
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
    
    // 隱藏插槽提示文字和原本的 disk 圖示
    const slotHint = reader.querySelector('.slot-hint');
    if (slotHint) slotHint.style.display = 'none';
    
    const slotOpening = reader.querySelector('.slot-opening');
    if (slotOpening) {
      slotOpening.style.display = 'none';
    }
    
    // 在插槽中顯示對應面的圖示
    const readerSlot = reader.querySelector('.reader-slot');
    const insertedIcon = document.createElement('div');
    insertedIcon.className = 'inserted-disk-icon';
    insertedIcon.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      z-index: 2;
    `;
    insertedIcon.textContent = side === 'A' ? '💿' : '📀';
    readerSlot.appendChild(insertedIcon);
    
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
    
    // 顯示插槽提示文字和原本的 disk 圖示
    const slotHint = reader.querySelector('.slot-hint');
    if (slotHint) slotHint.style.display = 'block';
    
    const slotOpening = reader.querySelector('.slot-opening');
    if (slotOpening) slotOpening.style.display = 'block';
    
    // 移除插入的 disk 圖示
    const insertedIcon = reader.querySelector('.inserted-disk-icon');
    if (insertedIcon) insertedIcon.remove();
    
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
