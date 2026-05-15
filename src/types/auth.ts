export interface SignUpData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  birthday: {
    month: string;
    day: string;
    year: string;
  };
  profilePhoto?: File | null;
}

export interface BirthdayOption {
  value: string;
  label: string;
}

export interface ProfilePhotoUploadProps {
  onPhotoChange?: (file: File | null) => void;
  error?: string;
}

export interface SignUpFormProps {
  onSubmit?: (data: SignUpData) => void;
  onLoginClick?: () => void;
}
