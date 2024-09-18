import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type UserData = {
  username: string
  realName: string | null
  email: string
}

export default function Component({ user }: { user: UserData }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="realName" className="text-sm font-medium text-gray-500">
              Name
            </Label>
            <p id="realName" className="mt-1 text-lg font-semibold">
              {user.realName ? <>
                <span>{user.realName}</span>
                <span className="text-gray-500"> ({user.username})</span>
              </> : user.username}
            </p>
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-500">
              Email
            </Label>
            <p id="email" className="mt-1 text-lg font-semibold">
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}