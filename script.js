let state = {
    menu: [],
    isAdmin: false,
    editingId: null
};

function init() {
    checkAdminStatus();
    loadMenuData();
    renderMenu();
}

function checkAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    state.isAdmin = isAdmin;
    updateAdminUI();
}

function updateAdminUI() {
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    
    if (state.isAdmin) {
        adminPanel.style.display = 'block';
        adminLoginBtn.style.display = 'none';
    } else {
        adminPanel.style.display = 'none';
        adminLoginBtn.style.display = 'block';
    }
    renderMenu();
}

function loadMenuData() {
    try {
        const savedMenu = localStorage.getItem('menuData');
        if (savedMenu) {
            state.menu = JSON.parse(savedMenu);
        } else {
            state.menu = [
                { id: 1, name: 'Nasi Goreng Spesial', price: 15000, category: 'food' },
                { id: 2, name: 'Mie Goreng Spesial', price: 12000, category: 'food' },
                { id: 3, name: 'Es Teh Manis', price: 3000, category: 'beverage' }
            ];
            saveMenuData();
        }
    } catch (error) {
        console.error('Error loading menu data:', error);
        alert('Error: Gagal memuat data menu');
        state.menu = [];
    }
}

function saveMenuData() {
    try {
        localStorage.setItem('menuData', JSON.stringify(state.menu));
    } catch (error) {
        console.error('Error saving menu data:', error);
        alert('Error: Gagal menyimpan data menu');
    }
}

function renderMenu() {
    const foodGrid = document.getElementById('foodGrid');
    const beverageGrid = document.getElementById('beverageGrid');

    const foodItems = state.menu.filter(item => item.category === 'food');
    const beverageItems = state.menu.filter(item => item.category === 'beverage');

    foodGrid.innerHTML = foodItems.map(item => `
        <div class="menu-item fade-in">
            <div class="menu-content">
                <h3 class="menu-name">${item.name}</h3>
                <p class="menu-price">Rp ${item.price.toLocaleString()}</p>
                ${state.isAdmin ? `
                    <div class="menu-actions">
                        <button onclick="editMenu(${item.id})" class="btn btn-primary">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteMenu(${item.id})" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    beverageGrid.innerHTML = beverageItems.map(item => `
        <div class="menu-item fade-in">
            <div class="menu-content">
                <h3 class="menu-name">${item.name}</h3>
                <p class="menu-price">Rp ${item.price.toLocaleString()}</p>
                ${state.isAdmin ? `
                    <div class="menu-actions">
                        <button onclick="editMenu(${item.id})" class="btn btn-primary">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteMenu(${item.id})" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function editMenu(id) {
    const item = state.menu.find(item => item.id === id);
    if (item) {
        showEditModal(item);
    }
}

function showAddModal() {
    state.editingId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Menu';
    document.getElementById('menuForm').reset();
    document.getElementById('menuModal').style.display = 'flex';
}

function showEditModal(item) {
    state.editingId = item.id;
    document.getElementById('modalTitle').textContent = 'Edit Menu';
    document.getElementById('menuName').value = item.name;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuCategory').value = item.category;
    document.getElementById('menuModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('menuModal').style.display = 'none';
    document.getElementById('menuForm').reset();
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('menuName').value.trim();
    const price = parseInt(document.getElementById('menuPrice').value);
    const category = document.getElementById('menuCategory').value;

    if (name.length < 3) {
        alert('Error: Nama menu minimal 3 karakter');
        return;
    }

    if (price < 1000) {
        alert('Error: Harga minimal Rp 1.000');
        return;
    }

    if (state.editingId) {
        updateMenu(state.editingId, { name, price, category });
    } else {
        addMenu({ name, price, category });
    }
    
    closeModal();
}

function addMenu(data) {
    const newId = Math.max(0, ...state.menu.map(item => item.id)) + 1;
    state.menu.push({ id: newId, ...data });
    saveMenuData();
    renderMenu();
    alert('Success: Menu berhasil ditambahkan');
}

function updateMenu(id, data) {
    const index = state.menu.findIndex(item => item.id === id);
    if (index !== -1) {
        state.menu[index] = { ...state.menu[index], ...data };
        saveMenuData();
        renderMenu();
        alert('Success: Menu berhasil diperbarui');
    }
}

function deleteMenu(id) {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
        state.menu = state.menu.filter(item => item.id !== id);
        saveMenuData();
        renderMenu();
        alert('Success: Menu berhasil dihapus');
    }
}

function confirmReset() {
    if (confirm('Apakah Anda yakin ingin mereset semua menu?')) {
        localStorage.removeItem('menuData');
        loadMenuData();
        renderMenu();
        alert('Success: Menu berhasil direset');
    }
}

function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        state.isAdmin = false;
        localStorage.setItem('isAdmin', 'false');
        updateAdminUI();
        alert('Success: Berhasil logout');
    }
}

document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const password = prompt('Masukkan password:');
    if (password === 'penowl08') {
        state.isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        updateAdminUI();
        alert('Success: Login berhasil');
    } else {
        alert('Password salah!');
    }
});

document.addEventListener('DOMContentLoaded', init);
