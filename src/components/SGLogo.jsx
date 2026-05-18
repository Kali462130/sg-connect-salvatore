export default function SGLogo({ width = 64, height = 64, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Red square - top 60% */}
      <rect x="0" y="0" width="100" height="60" fill="#E10514" />
      
      {/* White rectangle - middle */}
      <rect x="20" y="45" width="60" height="20" fill="white" />
      
      {/* Black square - bottom 40% */}
      <rect x="0" y="60" width="100" height="40" fill="#000000" />
    </svg>
  );
}
