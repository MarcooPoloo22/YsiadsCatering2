  // crudService.js
export const executeCrud = async (payload, includeCredentials = false) => {
    try {
      const response = await fetch('http://localhost/admin_dashboard_backend/actions/generic_crud.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: includeCredentials ? 'include' : 'same-origin'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('CRUD operation failed:', error);
      throw error;
    }
  };