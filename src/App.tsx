import { useTranslation } from 'react-i18next'
import { Button, Dropdown, type MenuProps } from 'antd'
import i18n from 'i18next'

function App () {
  const { t } = useTranslation()

  const handleChangeLanguage = (lang: string) : void => {
    void i18n.changeLanguage(lang)
  }

  const menu: MenuProps['items'] = [
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    { key: '1', label: 'English', onClick: () => { handleChangeLanguage('en-EN') } },
    { key: '2', label: 'Vietnamese', onClick: () => { handleChangeLanguage('vi-VN') } },
    { key: '3', label: 'Japanese', onClick: () => {handleChangeLanguage('jp-JP')} }
  ]

  return (
    <div className="w-screen h-screen">
      <Button type='link'> {t('welcome')} </Button>
      <Dropdown menu={{ items: menu }}>
        <Button type='primary' title='Change Language'>Change Language</Button>
      </Dropdown>
    </div>
  )
}

export default App
