import { useAppDispatch, useAppSelector } from "@/hooks/redux-hook"
import { setIsMenuCollapse } from "@/store/features/app/index.slice"

export function Navbar () {
  const dispatch = useAppDispatch()
  const { isMenuCollapse } = useAppSelector((store) => store.app)

  const handleCollapseSidebar = () => {
    dispatch(setIsMenuCollapse(!isMenuCollapse))
  }

  return (
    <div className="sticky top-0"
      onClick={handleCollapseSidebar}>
        navbar
    </div>
  )
}
