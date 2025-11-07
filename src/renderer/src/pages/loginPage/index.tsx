import React, { useState } from 'react'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import logo from '@public/assets/images/logo.png'
import { useIndex } from './hook/useIndex'

export const LoginPage: React.FC = () => {
  const { formLogin, handleChange, handleLogin, loading, errorFormLogin } = useIndex()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex items-center justify-center w-full min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center ">
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-600">SYSGATE</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  className="pl-10 h-[45px] text-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={formLogin.username}
                  onChange={handleChange}
                />
              </div>
              {errorFormLogin.username && (
                <p className="text-sm text-red-500">{errorFormLogin.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10 h-[45px] text-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={formLogin.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorFormLogin.password && (
                <p className="text-sm text-red-500">{errorFormLogin.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading.submit}>
              {loading.submit ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
