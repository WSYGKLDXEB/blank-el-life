import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Col,
  Row,
  Input,
  Card,
  tooltip,
  Message,
  MessageBox,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Tree,
  Descriptions,
  DescriptionsItem,
  Tag,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Image,
  DatePicker,
  Cascader,
  Table,
  TableColumn,
  Pagination
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(Input)
Vue.use(Card)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tree)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Image)
Vue.use(DatePicker)
Vue.use(Cascader)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(tooltip)
// Vue.use(Message)

Vue.prototype.$message = Message
// 确认框
Vue.prototype.$confirm = MessageBox.confirm