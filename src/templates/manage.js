import { html } from 'hono/html';

export const manageTemplate = (dtall, user) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard - iFrame Manager</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/bootstrap.min.css">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="/jquery.min.js"></script>
    <script src="/bootstrap.bundle.min.js"></script>
</head>
<body>
    <!-- Header -->
    <div class="dashboard-header">
        <div class="container-fluid">
            <div class="user-info">
                <div class="user-welcome">
                    <div class="user-avatar">${user.charAt(0).toUpperCase()}</div>
                    <div class="user-details">
                        <h4>${user}</h4>
                        <p><i class="fas fa-circle" style="font-size: 6px; color: #48bb78;"></i> Online</p>
                    </div>
                </div>
                <div class="header-actions">
                    <a href="/password" class="btn-header">
                        <i class="fas fa-key"></i> Password
                    </a>
                    <a href="/logout" class="btn-header">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="container-fluid">
            <!-- Table Card -->
            <div class="table-card">
                <div class="table-card-header">
                    <div class="table-card-title">
                        <h3><i class="fas fa-table"></i> iFrame Management</h3>
                        <p><span id="totalRecordsHeader">${dtall.length}</span> total records</p>
                    </div>
                    <div class="table-actions">
                        <button class="btn-sm-custom btn-primary-custom" id="Add">
                            <i class="fas fa-plus"></i> Add
                        </button>
                        <button class="btn-sm-custom btn-danger-custom" id="DeleteAll" data-toggle="modal" data-target="#deleteEmployeeModal">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                
                <!-- Search Bar -->
                <div class="search-wrapper">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search by param, title, or URL...">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                </div>
                
                <!-- Table Wrapper -->
                <div class="table-wrapper-container">
                    <div class="table-responsive">
                        <table class="data-table" id="tbfilter">
                            <thead>
                                <tr>
                                    <th style="width: 40px;">
                                        <input type="checkbox" id="selectAll">
                                    </th>
                                    <th style="width: 150px;">Param</th>
                                    <th>Title</th>
                                    <th>URL</th>
                                    <th style="text-align: center; width: 80px;">Forward param</th>
                                    <th style="width: 90px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dtall.map((post, i) => html`
                                    <tr id="${post.id}" class="data-row" data-note="${post.note || ''}">
                                        <td>
                                            <input type="checkbox" name="options[]" value="${post.id}">
                                        </td>
                                        <td class="param">
                                            <div class="param-display">
                                                <span>/</span>
                                                <input name="param" type="text" value="${post.param}" readonly>
                                            </div>
                                        </td>
                                        <td class="title-cell">
                                            <div class="title-with-note">
                                                <input class="title-input" name="name" type="text" value="${post.name}" readonly>
                                                <button class="note-icon-btn ${post.note ? 'has-note' : 'no-note'}" 
                                                        title="${post.note ? 'View note' : 'Add note'}"
                                                        data-toggle="modal" 
                                                        data-target="#noteModal">
                                                    <i class="fas fa-sticky-note"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td class="urliframe">
                                            <input type="url" name="url" value="${post.urliframe}" readonly>
                                        </td>
                                        <td style="text-align: center;">
                                            <input type="checkbox" class="querystr-checkbox" 
                                                   name="querystr" value="${post.id}" ${post.querystr ? 'checked' : ''}>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <button class="btn-icon btn-edit editt" title="Edit">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn-icon btn-delete delete" data-toggle="modal" data-target="#deleteEmployeeModal" title="Delete">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                        
                        <!-- No Results Message -->
                        <div class="no-results" id="noResults" style="display: none;">
                            <i class="fas fa-search"></i>
                            <h4>No results found</h4>
                            <p>Try adjusting your search keywords</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div class="pagination-wrapper">
                    <div class="pagination-info">
                        Showing <span id="showingFrom">1</span> to <span id="showingTo">10</span> of <span id="totalRecords">${dtall.length}</span> records
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-page" id="firstPage">
                            <i class="fas fa-angle-double-left"></i>
                        </button>
                        <button class="btn-page" id="prevPage">
                            <i class="fas fa-angle-left"></i>
                        </button>
                        <div id="pageNumbers" style="display: flex; gap: 5px;"></div>
                        <button class="btn-page" id="nextPage">
                            <i class="fas fa-angle-right"></i>
                        </button>
                        <button class="btn-page" id="lastPage">
                            <i class="fas fa-angle-double-right"></i>
                        </button>
                    </div>
                    <div class="page-size">
                        <label>Show:</label>
                        <select id="pageSize">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Note Modal -->
    <div class="modal fade note-modal" id="noteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-sticky-note"></i> Note
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" style="color: white;">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="note-display">
                        <div class="note-content">
                            <p class="note-text" id="noteText">No note</p>
                        </div>
                    </div>
                    <div class="note-edit-form">
                        <textarea id="noteTextarea" placeholder="Enter note..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="editNoteBtn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button type="button" class="btn btn-success" id="saveNoteBtn" style="display: none;">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Delete Modal -->
    <div class="modal fade" id="deleteEmployeeModal" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle"></i> Confirm Delete
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" style="color: white;">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin: 0;">Are you sure you want to delete?</p>
                    <p style="color: #e53e3e; font-size: 12px; margin: 8px 0 0 0;">
                        <i class="fas fa-info-circle"></i> This cannot be undone
                    </p>
                </div>
                <div class="modal-footer" style="padding: 10px 20px;">
                    <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-sm btn-danger remove">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="hidden" id="ab" data-id=""></div>
    
    <script src="/main.js"></script>
</body>
</html>
`;
