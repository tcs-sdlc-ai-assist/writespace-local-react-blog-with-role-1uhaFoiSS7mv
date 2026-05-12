import PropTypes from 'prop-types';

/**
 * Reusable statistics display card for admin dashboard.
 * Displays a label, value, and icon with gradient styling.
 * @param {Object} props
 * @param {string} props.label - The stat label text
 * @param {number|string} props.value - The stat value to display
 * @param {JSX.Element} props.icon - The icon element to render
 * @param {string} [props.gradient='bg-gradient-primary'] - Tailwind gradient class for the icon background
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function StatCard({ label, value, icon, gradient = 'bg-gradient-primary', className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-5 flex items-center gap-4 animate-fade-in ${className}`.trim()}
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white flex-shrink-0 ${gradient}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        <span className="text-sm font-medium text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.element.isRequired,
  gradient: PropTypes.string,
  className: PropTypes.string,
};

export default StatCard;