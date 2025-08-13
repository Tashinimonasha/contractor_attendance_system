const users = {
  'admin@printcare.com': { name: 'System Administrator', role: 'Admin', defaultPass: 'admin123' },
  'hr@printcare.com': { name: 'HR Manager', role: 'HR', defaultPass: 'hr123' },
  'finance@printcare.com': { name: 'Finance Manager', role: 'Finance', defaultPass: 'finance123' },
  'manager@printcare.com': { name: 'Dept. Manager', role: 'Manager', defaultPass: 'manager123' },
  'guard@printcare.com': { name: 'Security Guard', role: 'Guard', defaultPass: 'guard123' },
};

export const getMockUser = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = users[email];
      if (userData) {
        // This simulates checking both default and new passwords
        const isFirstLogin = password === userData.defaultPass;
        resolve({
          token: `mock-jwt-token-for-${email}`,
          isFirstLogin: isFirstLogin,
          user: {
            email: email,
            name: userData.name,
            role: userData.role,
          },
        });
      } else {
        resolve(null); // User not found
      }
    }, 500);
  });
};