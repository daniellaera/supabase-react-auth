import { Outlet } from "react-router-dom"
import ExpensesActions from "../components/ExpensesActions"

const ExpensesLayout = () => {
    return (
        <>
            <ExpensesActions />
            <Outlet />
        </>
    )
}

export default ExpensesLayout