import Form from "@/components/Form"
import Input from "@/components/Input"
import { getPrisma } from "@/util/db"
import { SettingKey } from "@prisma/client"

const settings: SettingKey[] = [
  "STRIPE_UNIT_PRICE",
]

const prisma = getPrisma()

export default async function Page() {
  const savedSettings = await prisma.setting.findMany({})

  async function saveSettings(formData: FormData) {
    "use server"
    for (const setting of settings) {
      const value = formData.get(setting) as string
      await prisma.setting.upsert({
        where: { key: setting },
        create: { key: setting, value },
        update: { value }
      })
    }
  }

  return <div>
    <span className="text-2xl">Settings</span>
    <Form submitButtonChildren="Save" action={saveSettings}>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Setting Key</th>
              <th>Setting Value</th>
            </tr>
          </thead>
          <tbody>
            {settings.map(setting => {
              return <tr key={setting}>
                <td>{setting}</td>
                <td>
                  <Input
                    type="text"
                    id={setting}
                    name={setting}
                    placeholder={setting}
                    defaultValue={savedSettings.find(s => s.key === setting)?.value}
                  />
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </Form>
  </div>
}