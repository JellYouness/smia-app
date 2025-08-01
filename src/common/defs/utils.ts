const Utils = {
  prettyNumber: (value: number, decimals = 2) => {
    return (Math.floor(value * 100) / 100).toFixed(decimals);
  },
  countLabel: (value: number, singular: string, plural: string) => {
    return `${value} ${value === 1 ? singular : plural}`;
  },

  getUserInitials: (firstName?: string, lastName?: string, email?: string): string => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '?';
  },
};

export default Utils;
