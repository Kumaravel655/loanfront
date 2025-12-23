import React, { useState, useEffect } from 'react';
import { loanService } from '../../services/loanService';
import { translations } from '../../utils/translations';
import { FaCog, FaUser, FaBell, FaPalette, FaTools, FaSave, FaArrowLeft } from 'react-icons/fa';
import styles from './Settings.module.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    theme: 'light',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  const t = translations[settings.language] || translations.en;

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // Auto theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    
    if (key === 'theme') {
      applyTheme(value);
    }
    if (key === 'language') {
      // Apply language change immediately
      document.documentElement.lang = value;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1><FaCog /> {t.settings}</h1>
        <p>{t.manageAccountPreferences}</p>
      </div>

      <div className={styles.settingsContent}>
        {/* Profile Settings */}
        <div className={styles.settingsSection}>
          <h2><FaUser /> {t.profileInfo}</h2>
          <div className={styles.profileInfo}>
            <div className={styles.profileItem}>
              <label>{t.username}:</label>
              <span>{user?.username || 'N/A'}</span>
            </div>
            <div className={styles.profileItem}>
              <label>{t.role}:</label>
              <span>{user?.role?.replace('_', ' ') || 'N/A'}</span>
            </div>
            <div className={styles.profileItem}>
              <label>{t.email}:</label>
              <span>{user?.email || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={styles.settingsSection}>
          <h2><FaBell /> {t.notificationPrefs}</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingRow}>
              <h4 className={styles.settingTitle}>{t.enableNotifications}</h4>
              <label className={styles.switchContainer}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className={styles.switch}></span>
              </label>
            </div>
            <p className={styles.settingDescription}>{t.receiveSystemNotifications}</p>
          </div>
          
          <div className={styles.settingItem}>
            <div className={styles.settingRow}>
              <h4 className={styles.settingTitle}>{t.emailAlerts}</h4>
              <label className={styles.switchContainer}>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                />
                <span className={styles.switch}></span>
              </label>
            </div>
            <p className={styles.settingDescription}>{t.receiveEmailAlerts}</p>
          </div>
          
          <div className={styles.settingItem}>
            <div className={styles.settingRow}>
              <h4 className={styles.settingTitle}>{t.smsAlerts}</h4>
              <label className={styles.switchContainer}>
                <input
                  type="checkbox"
                  checked={settings.smsAlerts}
                  onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                />
                <span className={styles.switch}></span>
              </label>
            </div>
            <p className={styles.settingDescription}>{t.receiveSmsAlerts}</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className={styles.settingsSection}>
          <h2><FaPalette /> {t.appearance}</h2>
          <div className={styles.settingItem}>
            <label>{t.theme}:</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className={styles.selectInput}
            >
              <option value="light">{t.light}</option>
              <option value="dark">{t.dark}</option>
              <option value="auto">{t.auto}</option>
            </select>
          </div>
          
          <div className={styles.settingItem}>
            <label>{t.language}:</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className={styles.selectInput}
            >
              <option value="en">{t.english}</option>
              <option value="hi">{t.hindi}</option>
              <option value="te">{t.telugu}</option>
              <option value="ta">{t.tamil}</option>
            </select>
          </div>
        </div>

        {/* System Settings */}
        <div className={styles.settingsSection}>
          <h2><FaTools /> {t.systemSettings}</h2>
          <div className={styles.systemInfo}>
            <div className={styles.infoItem}>
              <span>{t.version}:</span>
              <span>1.0.0</span>
            </div>
            <div className={styles.infoItem}>
              <span>{t.lastLogin}:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span>{t.sessionTimeout}:</span>
              <span>30 minutes</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.settingsActions}>
          <button
            onClick={handleSave}
            disabled={loading}
            className={styles.saveBtn}
          >
            {loading ? `${t.saving}...` : <><FaSave /> {t.saveSettings}</>}
          </button>
          
          <button
            onClick={() => window.history.back()}
            className={styles.cancelBtn}
          >
            <FaArrowLeft /> {t.back}
          </button>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;