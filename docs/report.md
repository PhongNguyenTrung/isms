THIẾT KẾ KIẾN TRÚC PHẦN MỀM
INTELLIGENT RESTAURANT MANAGEMENT SYSTEM (IRMS)

1. Giới thiệu
1.1 Tổng quan đề tài
Trong những năm gần đây, ngành dịch vụ nhà hàng đang phát triển mạnh mẽ cùng với xu hướng chuyển đổi số và ứng dụng các công nghệ mới như Internet of Things (IoT), trí tuệ nhân tạo và điện toán đám mây.
Các nhà hàng hiện đại không chỉ yêu cầu phục vụ nhanh chóng mà còn cần đảm bảo độ chính xác trong quy trình đặt món, tối ưu hóa hoạt động bếp và quản lý hiệu quả nguyên liệu nhằm giảm chi phí vận hành.
Tuy nhiên, trong mô hình nhà hàng truyền thống, quy trình order và xử lý món ăn vẫn phụ thuộc nhiều vào nhân viên phục vụ, dẫn đến các vấn đề phổ biến như:
Sai sót khi ghi nhận đơn hàng


Chậm trễ trong việc chuyển order xuống bếp


Khó theo dõi tiến độ chế biến món ăn


Quản lý tồn kho thủ công, thiếu cảnh báo sớm


Thiếu dữ liệu phân tích để tối ưu vận hành


Do đó, việc xây dựng một hệ thống quản lý nhà hàng thông minh tích hợp IoT là cần thiết nhằm nâng cao chất lượng phục vụ và hiệu quả vận hành.
1.2 Mục tiêu của hệ thống
Đồ án này tập trung thiết kế và triển khai hệ thống Intelligent Restaurant Management System (IRMS), một nền tảng ứng dụng IoT nhằm tự động hóa và tối ưu quy trình hoạt động trong nhà hàng.
Các mục tiêu chính của hệ thống bao gồm:
Cho phép khách hàng đặt món trực tiếp thông qua tablet hoặc QR menu
Đồng bộ luồng xử lý đơn hàng giữa khu vực bàn ăn và nhà bếp theo thời gian thực
Tối ưu hóa quản lý hàng đợi chế biến món ăn dựa trên tải bếp và độ phức tạp món
Theo dõi nguyên liệu và tồn kho bằng cảm biến IoT, hỗ trợ cảnh báo sớm
Cung cấp dashboard và phân tích dữ liệu phục vụ quản lý nhà hàng
Hệ thống hướng đến việc cải thiện trải nghiệm khách hàng, giảm thời gian chờ đợi và đảm bảo hiệu suất hoạt động ổn định trong môi trường nhà hàng.
1.3 Phạm vi và giới hạn của đồ án
Trong phạm vi bài tập lớn môn Kiến trúc phần mềm, đồ án tập trung vào việc:
Phân tích yêu cầu chức năng và phi chức năng của hệ thống IRMS


Thiết kế kiến trúc phần mềm theo hướng modular, scalable và reliable


Trình bày kiến trúc hệ thống dưới nhiều góc nhìn (module view, component & connector view, allocation view)


Áp dụng các nguyên lý thiết kế SOLID để tăng tính bảo trì và mở rộng


Triển khai minh họa ít nhất một module cốt lõi của hệ thống (ví dụ: Order Management Service)
Do giới hạn thời gian và phạm vi môn học, hệ thống sẽ được xây dựng dưới dạng mô hình prototype, tập trung vào kiến trúc và các thành phần chính thay vì triển khai đầy đủ toàn bộ chức năng như một sản phẩm thương mại.
1.4 Ý nghĩa thực tiễn của đề tài
Hệ thống IRMS mang lại nhiều giá trị thực tiễn cho nhà hàng hiện đại:
Tăng tốc độ phục vụ và giảm sai sót trong order


Hỗ trợ quản lý bếp hiệu quả trong giờ cao điểm


Giảm lãng phí nguyên liệu nhờ theo dõi tồn kho thông minh


Cung cấp dữ liệu phân tích giúp tối ưu nhân sự và menu


Tạo nền tảng để tích hợp các công nghệ AI và hệ thống đa kênh trong tương lai
Đây là một hướng ứng dụng tiêu biểu của kiến trúc Microservices kết hợp Event-Driven trong môi trường IoT, phù hợp với xu thế phát triển của ngành dịch vụ và công nghệ hiện nay.
2. Phân tích hệ thống
2.1 Tổng quan hệ thống
Trong hoạt động vận hành nhà hàng hiện đại, tốc độ phục vụ và độ chính xác trong xử lý đơn hàng là yếu tố quyết định trải nghiệm khách hàng. Tuy nhiên, nhiều nhà hàng vẫn gặp các vấn đề phổ biến như:
Quy trình order thủ công dẫn đến sai sót


Đơn hàng truyền xuống bếp chậm, gây thời gian chờ lâu


Nhà bếp khó theo dõi thứ tự ưu tiên trong giờ cao điểm


Quản lý tồn kho nguyên liệu chưa hiệu quả


Thiếu dữ liệu phân tích để tối ưu nhân sự và menu


Do đó, hệ thống Intelligent Restaurant Management System (IRMS) được đề xuất nhằm ứng dụng IoT để tự động hóa toàn bộ quy trình đặt món – chế biến – giám sát – quản lý vận hành.
IRMS tích hợp các thiết bị thông minh như tablet tại bàn, hệ thống hiển thị bếp (KDS), cảm biến tồn kho và cảm biến nhiệt độ, giúp đồng bộ dữ liệu theo thời gian thực và tăng hiệu quả quản lý nhà hàng.

2.1.2 Các Actor chính trong hệ thống
Hệ thống IRMS có nhiều nhóm người dùng và thiết bị tương tác. Các actor quan trọng được xác định như sau:
(1) Khách hàng (Customer)
Khách hàng là người trực tiếp sử dụng hệ thống tại bàn ăn thông qua tablet hoặc QR menu.
Chức năng liên quan:
Xem menu và lựa chọn món ăn
Đặt món trực tiếp mà không cần nhân viên ghi order
Theo dõi trạng thái đơn hàng
Yêu cầu thêm món trong quá trình dùng bữa
(2) Nhân viên phục vụ (Waiter/Staff)
Nhân viên phục vụ đóng vai trò hỗ trợ khách hàng và phối hợp với hệ thống trong quy trình vận hành.
Chức năng liên quan:
Hỗ trợ khách hàng khi gặp khó khăn trong đặt món
Nhận thông báo từ hệ thống khi có yêu cầu đặc biệt
Theo dõi tình trạng bàn và tiến độ order
(3) Nhân viên bếp (Kitchen Staff/Chef)
Nhân viên bếp là người tiếp nhận và xử lý các đơn hàng được gửi từ hệ thống.
Chức năng liên quan:
Nhận đơn hàng hiển thị trên Kitchen Display System (KDS)
Cập nhật trạng thái chế biến món ăn
Phối hợp xử lý đơn ưu tiên trong giờ cao điểm
(4) Quản lý nhà hàng (Restaurant Manager)
Quản lý sử dụng dashboard để giám sát hoạt động tổng thể của nhà hàng.
Chức năng liên quan:
Theo dõi tiến độ order và tải bếp theo thời gian thực
Nhận cảnh báo về tồn kho hoặc thiết bị bất thường
Xem báo cáo phân tích về doanh thu, vòng quay bàn
Sử dụng dữ liệu dự đoán để tối ưu nhân sự và menu
(5) Thiết bị IoT và cảm biến (IoT Devices & Sensors)
Các thiết bị IoT đóng vai trò cung cấp dữ liệu đầu vào liên tục cho hệ thống.
Bao gồm:
Tablet/QR menu: hỗ trợ khách đặt món
Load-cell sensors: theo dõi lượng nguyên liệu tồn kho
Temperature sensors: giám sát nhiệt độ tủ lạnh/tủ đông
Các thiết bị này giúp hệ thống vận hành theo thời gian thực và tăng tính tự động hóa.
2.2 Các chức năng nghiệp vụ chính
Từ góc nhìn nghiệp vụ, IRMS cung cấp các nhóm chức năng chính sau:
(1) IoT-Based Ordering System
Khách hàng đặt món qua tablet/QR menu
Đơn hàng được xác thực và phân loại tự động
Order được gửi trực tiếp xuống các trạm bếp phù hợp
(2) Real-Time Kitchen Order Queue Management
KDS hiển thị đơn hàng theo thời gian thực
Hệ thống ưu tiên hàng đợi dựa trên độ phức tạp món và tải bếp
Cảnh báo khi bếp quá tải hoặc có món cần xử lý gấp
(3) Smart Inventory & Ingredient Monitoring
Theo dõi lượng nguyên liệu bằng cảm biến
Cảnh báo khi nguyên liệu xuống dưới ngưỡng
Giám sát nhiệt độ thiết bị bảo quản thực phẩm
(4) Staff & Manager Dashboards
Dashboard theo dõi order flow, table turnover
Analytics hỗ trợ forecasting giờ cao điểm
Quản lý tối ưu lịch nhân sự và menu dựa trên dữ liệu
2.3 Yêu cầu chức năng
Các yêu cầu chức năng của hệ thống IRMS được xác định như sau:
ID
Functional Requirement
FR1
Khách hàng có thể đặt món thông qua tablet hoặc QR menu tại bàn
FR2
Hệ thống hiển thị menu điện tử và thông tin món ăn
FR3
Hệ thống tự động xác thực đơn hàng và phân loại món
FR4
Đơn hàng được gửi theo thời gian thực đến đúng trạm bếp
FR5
Kitchen Display System hiển thị danh sách order liên tục
FR6
Nhân viên bếp cập nhật trạng thái chế biến món ăn
FR7
Hệ thống quản lý hàng đợi chế biến và tự động ưu tiên đơn
FR8
Hệ thống phát cảnh báo khi bếp quá tải hoặc có món ưu tiên
FR9
Theo dõi tồn kho nguyên liệu bằng cảm biến load-cell
FR10
Cảnh báo khi nguyên liệu xuống dưới mức an toàn
FR11
Giám sát nhiệt độ thiết bị bảo quản thực phẩm bằng sensor
FR12
Dashboard hiển thị trạng thái đơn hàng, tải bếp và thiết bị
FR13
Quản lý xem báo cáo analytics về order flow và table turnover
FR14
Hệ thống hỗ trợ dự đoán busy periods để tối ưu lịch nhân sự

2.4 Yêu cầu phi chức năng
Ngoài nghiệp vụ, IRMS phải đáp ứng các yêu cầu phi chức năng nhằm đảm bảo chất lượng hệ thống trong môi trường nhà hàng thông minh.
NFR1 – Performance (Hiệu năng)
Đơn hàng phải được truyền từ khách đến bếp với độ trễ thấp
Dashboard cập nhật theo thời gian thực
Target: Order latency < 1s
NFR2 – Scalability (Khả năng mở rộng)
Hệ thống phải mở rộng khi số lượng khách và thiết bị IoT tăng
Có thể triển khai cho nhiều chi nhánh nhà hàng
NFR3 – Availability (Tính sẵn sàng)
IRMS phải hoạt động liên tục trong giờ kinh doanh
Uptime cao, hạn chế downtime
NFR4 – Reliability (Độ tin cậy)
Không được mất đơn hàng
Trạng thái đơn hàng phải nhất quán giữa tablet – bếp – dashboard
NFR5 – Security (Bảo mật)
Thiết bị IoT cần xác thực trước khi kết nối
Dữ liệu order và thanh toán phải được mã hóa và phân quyền
NFR6 – Maintainability (Khả năng bảo trì)
Các module cần thiết kế độc lập
Dễ thêm chức năng mới (AI forecasting, loyalty program…)
NFR7 – Fault Tolerance (Chịu lỗi IoT)
Nếu sensor mất kết nối, hệ thống vẫn tiếp tục vận hành
Event quan trọng cần lưu trữ và retry
NFR8 – Observability (Giám sát & Logging)
Hệ thống cần logging, monitoring và alerting
Quản lý có thể theo dõi nhanh sự cố trong vận hành


2.1 Yêu cầu chức năng
Mã
Mô tả
FR1
Khách hàng có thể đặt món thông qua tablet hoặc QR menu
FR2
Hệ thống tự động kiểm tra và phân loại món ăn (đồ uống, món phụ, món chính) và gửi đến trạm bếp tương ứng theo thời gian thực
FR3
Hệ thống hiển thị tiến độ chế biến trên Kitchen Display System (KDS)
FR4
Tự động ưu tiên thứ tự xử lý đơn hàng dựa trên mức độ phức tạp, tải bếp và thời gian phục vụ món
FR5
Cảnh báo cho nhân viên khi có yêu cầu cần chú ý về món ăn hoặc khi bếp quá tải
FR6
Theo dõi tồn kho nguyên liệu bằng cảm biến IoT
FR7
Cảnh báo khi nguyên liệu sắp hết hoặc thiết bị gặp sự cố
FR8
Cung cấp dashboard theo thời gian thực cho quản lý
FR9
Cung cấp chức năng phân tích về luồng đặt hàng, tốc độ xoay vòng, thanh toán, doanh thu theo ngày, tuần, tháng, khoảng thời gian
FR10
Dự đoán insights để lên lịch làm việc cho nhân viên, tối ưu thực đơn và dự báo thời điểm đông khách

2.2 Yêu cầu phi chức năng
Bên cạnh các yêu cầu chức năng, hệ thống Intelligent Restaurant Management System cần đáp  ứng các yêu cầu phi chức năng quan trọng nhằm đảm bảo quá trình vận hành thực tế trong nhà hàng, nơi các hoạt động, các đơn hàng liên tục đến, cần xử lý trong thời gian thực và cần sự phối hợp nhịp nhàng của các bên liên quan, Các yêu cầu phi chức năng được xác định như sau:
Mã
Mô tả
NFR1
Hệ thống phục được vài trăm đơn hàng vào giờ cao điểm. 
NFR2
Thời gian phản hồi khi đơn hàng được gửi từ bàn đến bếp < 1 giấy
NFR3
Hệ thống phải duy trì ổn định trong thời gian phục vụ
NFR4
Hệ thống đảm bảo không làm gián đoạn quy trình đặt món và chế biến khi có lỗi cục bộ
NFR5
Đơn hàng và dữ liệu bếp phải chính xác tuyệt đối nhằm tránh sai sót trong phục vụ khách hàng.
NFR6
Hệ thống cần có khả năng mở rộng để đáp ứng nhu cầu tăng trưởng về số lượng bàn ăn, khách hàng và chi nhánh nhà hàng.








Khả năng mở rộng (Scalability): đáp ứng lượng lớn đơn hàng vào giờ cao điểm


Hiệu năng (Performance): xử lý đơn hàng với độ trễ thấp


Độ tin cậy (Reliability): hệ thống vẫn hoạt động khi một thành phần gặp lỗi


Khả năng bảo trì (Maintainability): dễ dàng nâng cấp và mở rộng chức năng


Bảo mật (Security): đảm bảo an toàn dữ liệu giữa các thiết bị IoT và hệ thống trung tâm


3. ARCHITECTURE CHARACTERISTICS 
3.1 Giới thiệu
Trong thiết kế kiến trúc phần mềm, các yêu cầu chức năng chỉ mô tả hệ thống cần thực hiện những gì, tuy nhiên chưa đủ để đảm bảo hệ thống thành công khi triển khai thực tế. Do đó, kiến trúc cần được dẫn dắt bởi các architecture characteristics, đóng vai trò là các “success criteria” quan trọng nhất của hệ thống.
Đối với hệ thống Intelligent Restaurant Management System (IRMS), nhóm áp dụng phương pháp Architecture Kata để xác định architecture characteristics dựa trên business drivers và các kịch bản vận hành quan trọng, thay vì liệt kê một cách cảm tính.
3.2 Business Drivers
Các động lực nghiệp vụ chính thúc đẩy việc xây dựng IRMS bao gồm:
Tăng tốc độ phục vụ và giảm thời gian chờ thông qua đặt món trực tiếp tại bàn.


Giảm sai sót trong quy trình order bằng cách tự động hóa luồng đơn hàng từ khách đến bếp.


Tối ưu vận hành bếp trong giờ cao điểm nhờ cơ chế điều phối và ưu tiên hàng đợi chế biến.


Quản lý nguyên liệu thông minh nhằm giảm lãng phí và tránh thiếu hụt trong giờ phục vụ.


Cung cấp dữ liệu phân tích cho quản lý để hỗ trợ dự đoán nhu cầu và tối ưu nhân sự.



3.3 Architecturally Significant Scenarios
Theo Architecture Kata, nhóm xác định các kịch bản kiến trúc quan trọng nhất ảnh hưởng trực tiếp đến kiến trúc hệ thống:
S1 – Real-Time Order Processing: Khách đặt món qua tablet, đơn hàng phải được chuyển đến đúng trạm bếp gần như ngay lập tức.


S2 – Kitchen Overload Management: Khi bếp quá tải, hệ thống cần ưu tiên order và cảnh báo nhân viên.


S3 – Inventory Monitoring Alert: Khi nguyên liệu xuống dưới ngưỡng an toàn, hệ thống phải gửi cảnh báo kịp thời.


S4 – Sensor Failure Handling: Khi thiết bị IoT mất kết nối, hệ thống vẫn phải tiếp tục vận hành ổn định.


S5 – Manager Analytics Dashboard: Quản lý cần theo dõi order flow và dữ liệu vận hành gần real-time.


Các kịch bản này được xem là cơ sở để rút ra các tiêu chí chất lượng quan trọng nhất.
3.4 Prioritized Architecture Characteristics
Từ các business drivers và scenarios, nhóm xác định và ưu tiên các architecture characteristics của IRMS như sau:
Priority
Architecture Characteristic
Ý nghĩa đối với hệ thống
1
Real-Time Responsiveness
Đảm bảo order được xử lý nhanh, giảm thời gian chờ
2
Reliability & Consistency
Không mất đơn hàng, trạng thái đồng nhất giữa các thành phần
3
Scalability
Mở rộng khi lượng khách và thiết bị IoT tăng
4
Fault Tolerance (IoT)
Hệ thống vẫn hoạt động khi sensor hoặc thiết bị gặp lỗi
5
Availability
Duy trì uptime cao trong giờ kinh doanh
6
Maintainability & Modularity
Dễ bảo trì và mở rộng chức năng trong tương lai
7
Security
Xác thực thiết bị IoT và phân quyền người dùng
8
Observability
Giám sát, logging và cảnh báo trong vận hành thực tế

3.5 Architectural Implications
Các architecture characteristics trên dẫn đến một số định hướng kiến trúc quan trọng:
Để đáp ứng real-time responsiveness và giảm coupling giữa các module, hệ thống phù hợp với Event-Driven Architecture thông qua cơ chế publish/subscribe.


Để đảm bảo scalability và maintainability, hệ thống nên được tổ chức theo Microservices Architecture, trong đó các service như Ordering, Kitchen, Inventory và Analytics có thể phát triển và mở rộng độc lập.


Để xử lý môi trường thiết bị IoT không ổn định và tăng fault tolerance, cần có một lớp IoT Gateway Layer hỗ trợ buffering, retry và device management.


Để đáp ứng yêu cầu vận hành thực tế, hệ thống cần tích hợp các cơ chế observability, bao gồm logging tập trung, monitoring metrics và alerting.


3.6 Kết luận
Chương này đã áp dụng phương pháp Architecture Kata để xác định các architecture characteristics của hệ thống IRMS dựa trên business drivers và các kịch bản quan trọng. Các success criteria được ưu tiên rõ ràng và dẫn trực tiếp đến định hướng kiến trúc tổng thể:
Microservices + Event-Driven Architecture + IoT Gateway + Observability Support
4. ARCHITECTURE DESIGN (ARCHITECTURAL VIEWS)
4.1 Giới thiệu chương
Sau khi xác định các architecture characteristics quan trọng của hệ thống IRMS (real-time responsiveness, scalability, reliability, fault tolerance…), chương này trình bày thiết kế kiến trúc tổng thể của hệ thống theo các góc nhìn chuẩn trong Software Architecture.
Hệ thống IRMS được định hướng theo kiến trúc:
Microservices + Event-Driven Architecture + IoT Gateway Layer
Các kiến trúc views được trình bày gồm:
Module View (Decomposition)


Component & Connector View


Deployment (Allocation) View


Runtime Interaction Flow (Order Scenario)


4.2 Module View (Decomposition View)
4.2.1 Mục tiêu
Module View mô tả cách hệ thống được phân rã thành các module/service chính nhằm đảm bảo:
Tính modularity và maintainability


Khả năng scale độc lập theo tải


Fault isolation giữa các thành phần


4.2.2 Service Decomposition
Hệ thống IRMS được chia thành các microservices cốt lõi như sau:
Service/Module
Responsibility chính
Customer Ordering Service
Nhận order từ tablet/QR menu
Kitchen Management Service
Điều phối đơn hàng và kitchen queue
Inventory Monitoring Service
Theo dõi nguyên liệu từ IoT sensors
Notification & Alert Service
Gửi cảnh báo cho staff/manager
Analytics & Forecasting Service
Báo cáo, predictive insights
User & Access Management Service
Authentication và RBAC
IoT Gateway Service
Quản lý kết nối thiết bị IoT

4.2.3 Lý do phân rã
Việc phân tách thành các module độc lập giúp hệ thống đạt được:
Scalability: Ordering Service có thể scale mạnh trong giờ cao điểm


Reliability: Inventory Service không ảnh hưởng đến Kitchen Service


Maintainability: Dễ thêm AI recommendation hoặc loyalty program


4.3 Component & Connector View
4.3.1 Mục tiêu
Component & Connector View mô tả cách các service giao tiếp với nhau tại runtime.
Do yêu cầu real-time và giảm coupling, IRMS sử dụng mô hình:
REST/gRPC cho synchronous queries


Event Bus cho asynchronous communication


4.3.2 Key Components
Các component chính gồm:
Tablet/QR Client


Kitchen Display System (KDS)


IoT Sensors (load-cell, temperature)


Microservices backend


Message Broker/Event Bus


Central Database per service


4.3.3 Event-Driven Communication
Một số event quan trọng trong hệ thống:
Event
Publisher
Subscriber
OrderPlaced
Ordering Service
Kitchen Service
OrderInProgress
Kitchen Service
Dashboard Service
OrderCompleted
Kitchen Service
Notification Service
InventoryLow
Inventory Service
Manager Dashboard
TemperatureAlert
IoT Gateway
Notification Service

Event-driven giúp:
Real-time responsiveness


Loose coupling


Fault tolerance khi service downstream chậm


4.3.4 Connector Types
API Gateway → Services: REST


Service ↔ Service: Async events qua broker


IoT Devices → Gateway: MQTT/HTTP


Dashboard → Analytics: Query APIs


4.4 Deployment View (Allocation View)
4.4.1 Mục tiêu
Deployment View mô tả cách hệ thống được triển khai trên hạ tầng thực tế, đảm bảo:
Availability cao


Scale linh hoạt


Hỗ trợ IoT integration


4.4.2 Deployment Architecture
Hệ thống được triển khai theo mô hình cloud-native:
IoT devices tại nhà hàng


Gateway xử lý edge communication


Backend microservices chạy trên Kubernetes cluster


Event Bus đảm bảo message delivery


Monitoring stack cho observability


4.4.3 Allocation Mapping
Runtime Node
Deployed Components
Restaurant Edge Network
Tablets, Sensors, IoT Gateway
Cloud Cluster (K8s)
Ordering, Kitchen, Inventory Services
Messaging Layer
Kafka/RabbitMQ Broker
Data Layer
Service Databases
Observability Layer
Logging + Monitoring + Alerting

4.4.4 Availability Considerations
Critical services có replica > 1


Broker deployed in cluster mode


Gateway buffering khi mất kết nối cloud


4.5 Runtime Interaction Flow (Order Processing Scenario)
Scenario: Customer places an order
Luồng xử lý runtime chính:
Customer chọn món và gửi order từ tablet


Ordering Service validate và publish event OrderPlaced


Kitchen Service subscribe event và đưa vào kitchen queue


KDS hiển thị món cần chế biến


Chef cập nhật trạng thái → publish OrderInProgress


Khi hoàn thành → publish OrderCompleted


Notification Service gửi thông báo cho staff/customer


Analytics Service cập nhật dashboard real-time


Luồng này đảm bảo:
Order xử lý nhanh


Không blocking giữa các service


Dễ scale theo giờ cao điểm


4.6 Mapping Architecture to Success Criteria
Bảng dưới đây liên kết kiến trúc với architecture characteristics đã xác định:
Characteristic
Architectural Decision
Real-Time Responsiveness
Event Bus + Async Processing
Scalability
Microservices + Horizontal Scaling
Reliability
Persistent events + Idempotent consumers
Fault Tolerance
IoT Gateway buffering + retry
Availability
Replicated services + clustered broker
Maintainability
Modular service boundaries
Security
RBAC + JWT + secure IoT identity
Observability
Central logging + monitoring stack


4.7 Kết luận chương
Chương này đã trình bày kiến trúc tổng thể của IRMS theo các architectural views chuẩn. Kiến trúc Microservices kết hợp Event-Driven và IoT Gateway đáp ứng các yêu cầu quan trọng về real-time operations, scalability, fault tolerance và maintainability.


4. Thiết kế kiến trúc hệ thống
4.1 Lựa chọn phong cách kiến trúc
So sánh các phong cách kiến trúc:
Phong cách
Đánh giá
Monolithic
Không phù hợp do khó mở rộng
Layered
Dễ hiểu nhưng hạn chế với IoT
Microservices
Phù hợp cho hệ thống phân tán
Event-Driven
Phù hợp với dữ liệu thời gian thực

👉 Giải pháp được chọn:
 Microservices kết hợp Event-Driven Architecture, cho phép hệ thống xử lý dữ liệu IoT linh hoạt và mở rộng theo nhu cầu.
4.2 Các view kiến trúc

4.2.1 Module View
Order Management Module


Kitchen Management Module


Inventory Management Module


IoT Gateway Module


Notification Module


Analytics Module



4.2.2 Component & Connector View
Thiết bị IoT gửi dữ liệu đến IoT Gateway


Gateway phát sự kiện thông qua Message Broker


Các service xử lý sự kiện độc lập


Dashboard truy cập thông qua REST API



4.2.3 Allocation View
Thiết bị IoT triển khai tại bàn ăn, bếp, kho


Các microservice triển khai trên nền tảng cloud


Message Broker triển khai độc lập



5. Các quyết định kiến trúc (Architecture Decisions)
Áp dụng Microservices để tách biệt các domain nghiệp vụ


Sử dụng Event-driven để đảm bảo cập nhật thời gian thực


Mỗi service quản lý cơ sở dữ liệu riêng


Sử dụng API Gateway làm điểm truy cập tập trung



6. Nguyên lý thiết kế (Design Principles)
Single Responsibility Principle


Loose Coupling


High Cohesion


Separation of Concerns


Dependency Inversion



7. Áp dụng các nguyên lý SOLID
Single Responsibility (SRP): mỗi service đảm nhiệm một chức năng duy nhất


Open/Closed (OCP): mở rộng nghiệp vụ mà không sửa đổi code cũ


Liskov Substitution (LSP): các interface cho phép thay thế linh hoạt


Interface Segregation (ISP): interface nhỏ gọn cho từng nhóm thiết bị IoT


Dependency Inversion (DIP): các module phụ thuộc vào abstraction thay vì implementation



8. Báo cáo phản ánh (Reflection Report)
Trong quá trình thiết kế IRMS, việc áp dụng các nguyên lý SOLID giúp hệ thống trở nên rõ ràng, dễ mở rộng và dễ bảo trì hơn. Thách thức lớn nhất là xác định ranh giới giữa các service và thiết kế giao tiếp bất đồng bộ phù hợp. Tuy nhiên, nhờ tuân thủ SOLID, hệ thống có khả năng mở rộng linh hoạt và giảm thiểu tác động khi thay đổi yêu cầu.

9. Triển khai hệ thống (Code Implementation)
Nhóm đã lựa chọn triển khai Order Management Module nhằm minh họa kiến trúc và việc áp dụng SOLID. Module này chịu trách nhiệm tiếp nhận, xác thực và phát sự kiện đơn hàng đến các service khác. Mã nguồn được quản lý trên GitHub theo đường dẫn được cung cấp trong phần nộp bài.

10. Kết luận
Hệ thống IRMS là một ví dụ điển hình cho việc áp dụng kiến trúc Microservices kết hợp Event-driven trong môi trường IoT. Thiết kế kiến trúc rõ ràng cùng việc tuân thủ các nguyên lý SOLID giúp hệ thống đạt được tính mở rộng, độ tin cậy và khả năng bảo trì cao, đáp ứng tốt yêu cầu của một hệ thống quản lý nhà hàng hiện đại.


