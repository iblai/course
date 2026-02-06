"use client"

interface PortableVoiceAvatarProps {
  /** Size of the avatar in pixels */
  size?: number
  /** Custom class names */
  className?: string
  /** Background color */
  bgColor?: string
  /** Icon color */
  iconColor?: string
}

/**
 * PortableVoiceAvatar - A reusable voice/audio avatar component
 * Uses the same icon style as the header voice button
 */
export function PortableVoiceAvatar({
  size = 32,
  className = "",
  bgColor = "#38A1E5",
  iconColor = "#ffffff",
}: PortableVoiceAvatarProps) {
  const iconSize = Math.floor(size * 0.55)

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        className="flex-shrink-0"
      >
        <path
          d="M17.6039 37.2002V10.8002C17.6039 9.9188 18.3186 9.20417 19.2 9.2041C20.0814 9.2041 20.7961 9.91875 20.7961 10.8002V37.2002C20.7961 38.0817 20.0814 38.7962 19.2 38.7962C18.3186 38.7962 17.6039 38.0817 17.6039 37.2002ZM27.204 31.5144V17.2994C27.204 16.418 27.9185 15.7034 28.8 15.7033C29.6815 15.7033 30.396 16.418 30.396 17.2994V31.5144C30.396 32.3956 29.6815 33.1104 28.8 33.1104C27.9187 33.1104 27.204 32.3956 27.204 31.5144ZM8.00391 27.2486V21.1572C8.00391 20.2758 8.71855 19.5611 9.6 19.5611C10.4815 19.5611 11.1961 20.2758 11.1961 21.1572V27.2486C11.1961 28.1301 10.4815 28.8448 9.6 28.8448C8.71855 28.8448 8.00391 28.1301 8.00391 27.2486ZM36.804 27.2486V21.1572C36.804 20.2758 37.5185 19.5611 38.4 19.5611C39.2815 19.5611 39.996 20.2758 39.996 21.1572V27.2486C39.996 28.1301 39.2815 28.8448 38.4 28.8448C37.5185 28.8448 36.804 28.1301 36.804 27.2486Z"
          fill={iconColor}
        />
      </svg>
    </div>
  )
}

export default PortableVoiceAvatar
