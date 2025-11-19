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
    <div className="w-full h-full flex items-center justify-center p-0">
      <Card className="border-0 shadow-none bg-transparant w-full mx-4 rounded-xl">
        <CardHeader className="space-y-1 text-center pb-2 px-6 pt-6">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-lg font-bold text-gray-600 dark:text-gray-300">
            SYSGATE
          </CardTitle>
          <CardDescription className="text-xs dark:text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4 px-6">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  className="pl-8 h-9 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  value={formLogin.username}
                  onChange={handleChange}
                />
              </div>
              {errorFormLogin.username && (
                <p className="text-xs text-red-500 mt-0.5">{errorFormLogin.username}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="pl-8 pr-8 h-9 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  value={formLogin.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {errorFormLogin.password && (
                <p className="text-xs text-red-500 mt-0.5">{errorFormLogin.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-9 mt-1 text-sm font-medium"
              disabled={loading.submit}
            >
              {loading.submit ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
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
