export default function formatDate(date) {
   const day = date.getDate();
   const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];
   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

   // Function to get ordinal suffix
   function getOrdinalSuffix(day) {
      if (day > 3 && day < 21) return 'th'; // Covers 11th to 19th
      switch (day % 10) {
         case 1:
            return 'st';
         case 2:
            return 'nd';
         case 3:
            return 'rd';
         default:
            return 'th';
      }
   }

   const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
   const month = monthNames[date.getMonth()];
   const year = date.getFullYear();
   const dayName = dayNames[date.getDay()];

   return `${dayWithSuffix} ${month} ${year}, ${dayName}`;
}
