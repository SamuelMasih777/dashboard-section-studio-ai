import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SaveIcon, Loader2, UserIcon } from 'lucide-react';

export function SettingsPage() {
  const { user, saveUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setMessage(null);

    const res = await updateProfile({ name: name.trim() });
    
    setIsSaving(false);
    
    if (res.success && res.user) {
      saveUser(res.user);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information.</p>
      </div>

      <div className="glass rounded-2xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
        <div className="p-6 md:p-8 border-b border-border/50 bg-muted/20 flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-lg ring-4 ring-background">
            {user?.initials || '?'}
          </div>
          <div className="text-center sm:text-left pt-2">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {user?.role === 'admin' ? 'Admin' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User')}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            Personal Information
          </h3>

          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-semibold">Display Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`max-w-md ${!isEditing ? 'bg-muted/50 cursor-not-allowed opacity-70 border-transparent' : 'bg-background'}`}
                readOnly={!isEditing}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is the name that will be displayed in the application header.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
              <Input
                id="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="max-w-md bg-muted/50 cursor-not-allowed opacity-70"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your email address cannot be changed. Contact support if you need assistance.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-semibold">Account Role</label>
              <Input
                id="role"
                value={user?.role === 'admin' ? 'Admin' : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User')}
                readOnly
                disabled
                className="max-w-md bg-muted/50 cursor-not-allowed opacity-70 border-transparent"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-border/50 flex gap-3">
              {!isEditing ? (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="min-w-[140px]"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving || name === user?.name}
                    className="min-w-[140px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
