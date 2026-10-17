import { AvatarMenu } from '#/components/shared/avatar-menu'
import { Button } from '#/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '#/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import type { ActionResult } from '#/types/action-result'
import { Link, useLocation } from '@tanstack/react-router'

type HeaderMenuProps = ActionResult<{
  email: string
  name: string
}>

export function Header({ success, data }: HeaderMenuProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  // Navigation links array to be used in both desktop and mobile menus
  const navigationLinks = [
    { id: 0, href: '/blog', label: 'Blog' },
    { id: 1, href: '/about', label: 'Sobre' },
    { id: 2, href: '/contact', label: 'Contato' },
  ]
  return (
    <header className="p-5">
      <div className="flex items-center justify-between gap-4 rounded-md px-4 backdrop-blur-xs">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-primary/90 text-lg font-bold md:text-2xl"
            >
              Acme Inc.
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.id}>
                    <NavigationMenuLink
                      asChild
                      className="py-1.5"
                      active={pathname === link.href}
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>

                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.id} className="w-full">
                      <NavigationMenuLink
                        asChild
                        className="py-1.5"
                        active={pathname === link.href}
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        </div>
        {/* Right side */}
        {success ? (
          <AvatarMenu {...data} />
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/auth/sign-in">
              <Button variant="outline">Acessar</Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
