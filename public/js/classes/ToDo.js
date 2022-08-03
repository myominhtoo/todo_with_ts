export class ToDo {
    static format(id, todo, category, status) {
        let statusFormat = status
            ? `<button class='btn btn-sm btn-success  toggle-status-btn' data-target='${id},${status}'>Done</button>`
            : `<button class='btn btn-sm btn-danger toggle-status-btn' data-target='${id},${status}'>Not yet</button>`;
        return `
        <tr>
            <td>${id}</td>
            <td>${todo}</td>
            <td class="fw-bold">${category}</td>
            <td>${statusFormat}</td>
            <td class="d-flex gap-2"><button class="btn btn-sm btn-warning update-btn" data-target="${id}">Update</button><button class="btn btn-sm btn-danger delete-btn" data-target="${id}">Delete</button></td>
        </tr>
       `;
    }
}
