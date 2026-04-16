ĐẠI HỌC QUỐC GIA, THÀNH PHỐ HỒ CHÍ MINH 
TRƯỜNG ĐẠI HỌC BÁCH KHOA 
KHOA KHOA HỌC VÀ KỸ THUẬT MÁY TÍNH 

KIẾN TRÚC PHẦN MỀM 
BÁO CÁO BÀI TẬP LỚN 
Intelligent Tutoring System 
GVHD: Lê Đình Thuận 
SV thực hiện: Nguyễn Tuấn Anh 2252038 
Dương Thanh Tú 2252879 
Vương Thanh Phương 2252658 
Trần Gia Quí 2252694 
Ngô Ngọc Triệu Mẫn 2212009 
TP Hồ Chí Minh, Tháng 12 Năm 2025
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Mục lục 
1 Phân Chia Công Việc 4 
2 Ngữ Cảnh 6 2.1 Stakeholders and Needs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 2.1.1 Học viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 2.1.2 Giảng viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6 2.1.3 Quản trị viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 2.1.4 Bộ phận quản lý đào tạo . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 2.2 Functional Requirement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7 2.2.1 User Management and Authentication . . . . . . . . . . . . . . . . . . . . 7 2.2.2 Personalized Learning . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8 2.2.3 Assessment and Feedback . . . . . . . . . . . . . . . . . . . . . . . . . . . 9 2.2.4 Instructor Dashboard . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10 2.2.5 Learning Content Management . . . . . . . . . . . . . . . . . . . . . . . . 11 2.3 Non-functional Requirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12 2.4 Outlining . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12 2.4.1 Scope . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12 2.4.2 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13 
3 Tính Chất Kiến Trúc (Architecture Characteristic) 14 
4 Kiến trúc hệ thống 16 4.1 Kiến trúc phân lớp . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16 4.1.1 Giới thiệu về kiến trúc phân lớp (Layered Architecture) . . . . . . . . . . 16 4.1.2 Sự phù hợp với ITS . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17 4.2 Kiến trúc vi dịch vụ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17 4.2.1 Giới thiệu về kiến trúc vi dịch vụ (Microservices Architecture) . . . . . . 17 4.2.2 Sự phù hợp với ITS . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19 4.3 Kiến trúc dựa trên dịch vụ (Service-based Architecture) . . . . . . . . . . . . . . 19 4.3.1 Giới thiệu về kiến trúc dựa trên dịch vụ (Service-based Architecture) . . . 19 4.3.2 Sự phù hợp với ITS . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20 4.4 Chọn lựa kiến trúc hệ thống phù hợp . . . . . . . . . . . . . . . . . . . . . . . . . 21 4.5 Module View . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22 4.5.1 Tổng quan . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22 4.5.2 User Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22 4.5.3 Personalized Learning Module . . . . . . . . . . . . . . . . . . . . . . . . 24 4.5.4 Assessment and Evaluation Module . . . . . . . . . . . . . . . . . . . . . 25 4.5.5 Learning Content Management Module . . . . . . . . . . . . . . . . . . . 26 4.5.6 Instructor Dashboard Module . . . . . . . . . . . . . . . . . . . . . . . . . 27 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 1/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.6 Component and Connector View . . . . . . . . . . . . . . . . . . . . . . . . . . . 29 4.6.1 Mô tả . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29 4.7 Allocation View . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32 
5 Class Diagram 35 5.1 User Management Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 35 5.2 Personalized Learning Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 39 5.3 Assessment and Feedback Module . . . . . . . . . . . . . . . . . . . . . . . . . . 44 5.4 Instructor Dashboard Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52 5.5 Learning Management Module . . . . . . . . . . . . . . . . . . . . . . . . . . . . 60 
6 Nguyên lý SOLID 64 6.1 Nguyên lý trách nhiệm đơn (Single Responsibility Principle - SRP) . . . . . . . . 64 6.2 Nguyên lý mở/đóng (Open/Closed Principle - OCP) . . . . . . . . . . . . . . . . 65 6.3 Nguyên lý thay thế Liskov (Liskov Substitution Principle - LSP) . . . . . . . . . 66 6.4 Nguyên lý phân tách giao diện (Interface Segregation Principle - ISP) . . . . . . 66 6.5 Nguyên lý đảo ngược phụ thuộc (Dependency Inversion Principle - DIP) . . . . . 67 
7 Phát triển trong tương lai 69 7.1 Nâng cao khả năng "Thông minh" của hệ thống (Advanced AI/ML) . . . . . . . 69 7.2 Chuyển đổi và Tối ưu hóa Kiến trúc (Architectural Evolution) . . . . . . . . . . 69 7.3 Mở rộng Hệ sinh thái và Tính năng (Ecosystem Expansion) . . . . . . . . . . . . 70 7.4 Tăng cường Bảo mật và Giám sát thi cử (Proctoring) . . . . . . . . . . . . . . . 70 
8 Triển Khai Code 71 8.1 Source Code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 71 8.2 Công nghệ sử dụng . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 71 8.3 Cấu trúc backend . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 73 
8.3.1 Cấu trúc thư mục backend tổng quát . . . . . . . . . . . . . . . . . . . . . 73 8.3.2 Cấu trúc thư mục backend cho phần xài chung . . . . . . . . . . . . . . . 74 8.3.3 Cấu trúc thư mục backend của từng module . . . . . . . . . . . . . . . . . 75 
8.4 Áp dụng SOLID trong code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 77 8.4.1 Single Responsibility Principle (SRP) . . . . . . . . . . . . . . . . . . . . 77 8.4.2 Open/Closed Principle (OCP) . . . . . . . . . . . . . . . . . . . . . . . . 84 8.4.3 Liskov Substitution Principle (LSP) . . . . . . . . . . . . . . . . . . . . . 86 
8.5 Interface Segregation Principle (ISP) . . . . . . . . . . . . . . . . . . . . . . . . . 87 8.5.1 Dependency Inversion Principle (DIP) . . . . . . . . . . . . . . . . . . . . 87 
9 Hiện thực 91 9.1 Trang Đăng nhập . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 91 9.2 Dành cho Admin . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 92 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 2/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
9.2.1 Trang Quản lý người dùng . . . . . . . . . . . . . . . . . . . . . . . . . . 92 9.2.2 Trang Quản lý khóa học . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 9.2.3 Trang Tạo khóa học mới . . . . . . . . . . . . . . . . . . . . . . . . . . . . 93 9.2.4 Trang Danh sách lớp học . . . . . . . . . . . . . . . . . . . . . . . . . . . 94 9.2.5 Trang Gán sinh viên vào lớp . . . . . . . . . . . . . . . . . . . . . . . . . 94 9.2.6 Trang Gán giáo viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 95 9.2.7 Trang Chỉnh sửa hồ sơ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 95 
9.3 Dành cho Giáo viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 96 9.3.1 Trang Danh sách khóa học . . . . . . . . . . . . . . . . . . . . . . . . . . 96 9.3.2 Trang Chi tiết khóa học . . . . . . . . . . . . . . . . . . . . . . . . . . . . 96 9.3.3 Trang Đăng học liệu mới . . . . . . . . . . . . . . . . . . . . . . . . . . . 97 9.3.4 Trang Kiểm tra . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 97 9.3.5 Trang Hồ sơ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 98 
9.4 Dành cho Học viên . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99 9.4.1 Trang Danh sách khóa học . . . . . . . . . . . . . . . . . . . . . . . . . . 99 9.4.2 Trang Chi tiết khóa học . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99 9.4.3 Trang Kiểm tra . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 100 9.4.4 Trang Hồ sơ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 100 
10 Reflection Report 101 10.1 Mục tiêu và phạm vi phản tư . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 101 10.2 Những điểm đạt được . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 101 10.3 Khó khăn và hạn chế . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 101 10.4 Bài học rút ra về kiến trúc phần mềm . . . . . . . . . . . . . . . . . . . . . . . . 101 10.5 Bài học về làm việc nhóm và quy trình . . . . . . . . . . . . . . . . . . . . . . . . 102 10.6 Định hướng cải tiến trong tương lai . . . . . . . . . . . . . . . . . . . . . . . . . . 102 10.7 Kết luận . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 102 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 3/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
1 Phân Chia Công Việc 
Tên thành viên 
MSSV 
Công việc 
Đóng góp
Nguyễn Tuấn Anh 
2252038
• Phát triển Frontend 
• Phát triển Backend 
• Learning Content Management Module (Class Diagram & Functional Require ment) 
• Package Diagram 
• Thiết kế slide 
• Xác định tính chất kiến trúc 
• So sánh và lựa chọn kiến trúc phù hợp • Cấu trúc thư mục backend 
• Áp dụng SOLID vào code
100%
Dương Thanh Tú 
2252879
• Phát triển Backend 
• Component Diagram 
• Personalized Learning Module (Class Diagram & Functional Requirement)
100%
Vương Thanh Phương
2252658
• Phát triển Backend 
• Deployment Diagram 
• Assessment & Evaluation Module (Class Diagram & Functional Requirement)
100%



Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 4/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Tên thành viên 
MSSV 
Công việc 
Đóng góp
Trần Gia Quí 
2252694
• Phát triển Frontend 
• User Management Module (Class Dia gram & Functional Requirement) 
• Giao diện tổng quan 
• Phát triển trong tương lai
100%
Ngô Ngọc Triệu Mẫn
2212009
• Phát triển Frontend 
• Instructor Dashboard Module (Class Di agram & Functional Requirement) 
• Áp dụng SOLID trong thiết kế 
• Non-functional Requirement 
• Outlining 
• Đồng bộ Functional Requirement của các module sao cho cùng format
100%



Table 1: Phân công công việc và mức độ đóng góp của các thành viên 
Lưu ý: Đối với hiện thực code, nhóm làm tổng cộng 2 module chính như sau: • User Management (Quản Lý Người Dùng) 
• Learning Content Management (Quản Lý Tài Nguyên Học Tập) 
Đường dẫn cho hình ảnh các sơ đồ phòng trường hợp hình quá nhỏ trong báo cáo: • Class Diagram, Package Diagram, Deployment Diagram 
• Component Diagram 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 5/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
2 Ngữ Cảnh 
2.1 Stakeholders and Needs 
2.1.1 Học viên 
1. Description: 
Học viên là người trực tiếp sử dụng ITS để học tập, làm bài đánh giá và theo dõi tiến trình của mình. Họ cần một hệ thống đơn giản, dễ dùng và có khả năng cá nhân hóa nội dung dựa trên trình độ, lịch sử học tập và mục tiêu của họ. Hệ thống phải cung cấp phản hồi rõ ràng, kịp thời và hỗ trợ họ cải thiện trong quá trình tự học. 
2. Needs: 
• Giao diện trực quan, dễ sử dụng, phù hợp cho người học ở nhiều trình độ công nghệ. • Lộ trình học tập cá nhân hóa dựa trên mục tiêu, phong cách học và mức độ thành thạo. 
• Truy cập nhanh vào tài liệu học tập, bài giảng, nội dung tương tác. 
• Thực hiện bài đánh giá, lưu tiến độ làm bài, xem gợi ý (nếu cho phép) và nhận phản hồi chi tiết. 
• Khả năng xem lại kết quả học tập, thống kê tiến độ và đề xuất “bước học tiếp theo”. • Nhận thông báo về bài tập mới, deadline, tài liệu mới được đăng tải. 
2.1.2 Giảng viên 
1. Description: 
Giảng viên chịu trách nhiệm quản lý nội dung học tập, tạo/ cấu hình các bài kiểm tra, đánh giá kết quả và theo dõi tiến độ của học viên. Họ cần công cụ mạnh mẽ để tạo bài tập, nhận báo cáo phân tích, điều chỉnh lộ trình học và tương tác với học viên. 
2. Needs: 
• Hệ thống quản lý nội dung học tập: đăng tải, chỉnh sửa, phân loại và ẩn/hiện tài liệu. • Công cụ tạo bài đánh giá: cấu hình thời gian, số lần làm lại, dạng câu hỏi, mức độ khó. 
• Chấm điểm tự động cho câu hỏi khách quan và giao diện chấm thủ công cho câu hỏi tự luận. 
• Viết nhận xét, gợi ý, giải thích chi tiết cho từng câu hỏi. 
• Dashboard theo dõi tiến độ học viên, thống kê lớp học và xuất báo cáo tùy chỉnh. • Công cụ điều chỉnh lộ trình học tập nếu ITS đưa ra dự đoán không chính xác. • Quản lý diễn đàn khóa học và trả lời câu hỏi của học viên. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 6/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
2.1.3 Quản trị viên 
1. Description: 
Admin quản lý toàn bộ hoạt động của nền tảng ITS, bao gồm tạo khóa học, phân quyền người dùng, giám sát dữ liệu và đảm bảo hệ thống hoạt động ổn định. 
2. Needs: 
• Tạo, cập nhật, xuất bản hoặc ẩn/hiện khóa học. 
• Quản lý phân quyền: chỉ định giảng viên cho từng khóa học, thiết lập danh sách học viên được truy cập. 
• Theo dõi danh sách giảng viên và học viên của mỗi khóa học. 
• Giám sát tính ổn định của hệ thống, xử lý sự cố và quản lý dữ liệu. 
• Đảm bảo tuân thủ các chính sách bảo mật, phân quyền và xác thực người dùng. 
• Công cụ quản lý cấu hình hệ thống (thời hạn nộp bài, giới hạn bộ nhớ, rule học tập,. . . ). 
2.1.4 Bộ phận quản lý đào tạo 
1. Description: 
Đơn vị quản lý đào tạo yêu cầu hệ thống hỗ trợ giám sát chất lượng giảng dạy, theo dõi kết quả của các lớp học và đảm bảo nền tảng phù hợp với chính sách học thuật. 
2. Needs: 
• Báo cáo tổng hợp về tình trạng học tập của học viên theo khóa, theo khoa hoặc theo giảng viên. 
• Công cụ đánh giá chất lượng giảng dạy qua dữ liệu ITS (tỉ lệ hoàn thành, mức độ tương tác, hiệu suất học tập). 
• Đảm bảo nền tảng tuân thủ quy định học thuật, bảo mật dữ liệu học viên và chuẩn chất lượng đào tạo. 
• Khả năng tích hợp ITS với các hệ thống khác trong trường (LMS, SIS trong tương lai). 
2.2 Functional Requirement 
2.2.1 User Management and Authentication 
Đối với Khách (Guest) và Người dùng chưa đăng nhập: 
• Xác thực: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 7/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– Người dùng có thể đăng nhập bằng gmail và mật khẩu được admin cung cấp. Đối với Người dùng đã đăng nhập (Authenticated User): 
• Quản lý hồ sơ cá nhân: 
– Người dùng phải có khả năng xem thông tin hồ sơ cá nhân của mình. – Người dùng phải có khả năng cập nhật thông tin cá nhân. 
• Phiên làm việc: 
– Người dùng phải có khả năng đăng xuất khỏi hệ thống an toàn. 
Đối với Quản trị viên (Admin): 
• Quản lý người dùng hệ thống: 
– Quản trị viên phải có khả năng xem danh sách toàn bộ người dùng trong hệ thống. 
– Quản trị viên phải có khả năng tìm kiếm hoặc xem chi tiết thông tin của một người dùng cụ thể theo tên đăng nhập. 
– Quản trị viên phải có khả năng đình chỉ hoặc xóa người dùng khỏi hệ thống. • Quản lý trạng thái và Phân quyền: 
– Quản trị viên phải có khả năng kích hoạt hoặc vô hiệu hóa tài khoản người dùng (ví dụ: khóa tài khoản vi phạm). 
– Quản trị viên phải có khả năng phân quyền cho người dùng (ví dụ: gán vai trò Sinh viên, Giáo viên, Admin...). 
– Quản trị viên phải có khả năng kiểm tra vai trò hiện tại của một người dùng. – Hệ thống phải cho phép thêm hoặc gỡ bỏ vai trò của một người dùng cụ thể. 
2.2.2 Personalized Learning 
Đối với giảng viên: 
• Quản lí hồ sơ và Mô hình người học: 
– Tạo/Cập nhật hồ sơ học tập (mục tiêu, phong cách học, ràng buộc thời gian). 
– Duy trì learner model (mastery theo mục tiêu/kiến thức, lịch sử tương tác, knowledge trace). 
• Chẩn đoán và Đánh giá: 
– Chạy diagnostic test lần đầu để ước lượng mức khởi điểm. 
– Đánh giá liên tục(qua quiz, bài tập, hành vi) và cập nhật mastery theo thời gian thực. Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 8/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Gợi ý thích ứng và Sắp xếp lộ trình học: 
– Xem Gợi ý nội dung theo mục tiêu, mức độ thành thạo, sở thích, và prerequisite graph. 
– Adaptive sequencing: “bước học tiếp theo” (next best activity) dựa trên mastery, độ khó tối ưu. 
– Cho phép chiến lược (rule-based, multi-armed bandit, mastery-based, curriculum pac ing). 
• Theo dõi tiến độ và Phân tích học tập: 
– Ghi nhận tiến độ theo mục tiêu (topic → objective → skill). 
– Xuất insight cho dashboard GV. 
2.2.3 Assessment and Feedback 
Đối với giảng viên: 
• Quản lý bài kiểm tra: 
– Giảng viên phải có khả năng tạo mới các bài đánh giá (ví dụ: quizzes, exercises, projects). 
– Giảng viên phải có khả năng định cấu hình cho bài đánh giá (tên, mô tả, thời gian bắt đầu, thời gian kết thúc, thời gian làm bài, số lần thử lại. . . ). 
– Giảng viên phải có khả năng thêm/xóa/sửa các câu hỏi trong một bài đánh giá. • Cấu hình nội dung phản hồi: 
– Giảng viên phải có khả năng soạn thảo gợi ý (Hints) cho từng câu hỏi (để hỗ trợ học viên khi họ gặp khó khăn). 
– Giảng viên phải có khả năng soạn thảo giải thích chi tiết cho đáp án của từng câu hỏi. 
– Giảng viên phải có khả năng cấu hình cách phản hồi cho bài kiểm tra (Ví dụ: Cho phép xem gợi ý khi đang làm bài, chỉ hiện giải thích sau khi nộp bài, hoặc hiện đáp án ngay sau khi chọn). 
• Chấm điểm và phản hồi: 
– Hệ thống phải có khả năng tự động chấm điểm cho các câu hỏi dạng khách quan (như trắc nghiệm). 
– Hệ thống phải cung cấp giao diện cho giảng viên để chấm điểm thủ công các câu hỏi dạng chủ quan (như tự luận, dự án). 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 9/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– Giảng viên phải có khả năng viết nhận xét/phản hồi cụ thể cho từng câu trả lời của học viên (ví dụ: chỉ ra lỗi sai logic trong bài code hoặc bài văn). 
– Hệ thống phải tính toán tổng điểm cho bài nộp của học viên. 
– Hệ thống phải lưu trữ kết quả (điểm số, phản hồi của giảng viên nếu có. . . ) các bài nộp sau khi chấm. 
Đối với học viên: 
• Thực hiện bài đánh giá: 
– Học viên phải có khả năng xem danh sách các bài đánh giá được giao. – Học viên phải có khả năng thực hiện bài đánh giá (trả lời câu hỏi, nộp bài). – Hệ thống phải tự động lưu trữ câu trả lời của học viên khi họ thực hiện. 
– Trong quá trình làm bài (nếu cấu hình cho phép), học viên có thể yêu cầu hệ thống hiển thị Gợi ý (Hint) liên quan đến câu hỏi hiện tại. 
– Hệ thống phải ghi nhận việc học viên đã sử dụng gợi ý (có thể dùng để trừ điểm hoặc đánh giá mức độ thành thạo sau này). 
– Hệ thống phải ghi nhận và lưu trữ bài nộp của học viên. 
• Xem lại kết quả và nhận phản hồi chi tiết: 
– Học viên phải có khả năng xem lại các bài nộp đã được chấm. 
– Học viên phải xem được giải thích chi tiết của giảng viên cho từng câu hỏi (tại sao đúng, tại sao sai) sau khi có kết quả. 
– Học viên phải xem được các nhận xét thủ công của giảng viên đối với mỗi câu hỏi. 
– Hệ thống phải hiển thị thông điệp phản hồi tổng quan dựa trên kết quả (Ví dụ: "Bạn làm tốt phần Lý thuyết nhưng cần cải thiện phần Bài tập vận dụng"). 
2.2.4 Instructor Dashboard 
Đối với giảng viên: 
• Theo dõi tiến độ: 
– Xem tổng quan hiệu suất của các học viên của mình (có thể thêm biểu đồ phân phối điểm, tỉ lệ hoàn thành bài học). 
– Xem chi tiết bài học/bài tập từng học viên (đã học, chưa học, đang học). – Xem lịch sử hoạt động (thời gian học, làm bài). 
– Điều chỉnh độ khó/lộ trình học nếu ITS dự đoán sai. 
• Quản lý nội dung bài đăng: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 10/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– Tạo bài học/bài tập/bài trắc nghiệm/dự án mới cho từng học viên. 
– Chỉnh sửa bài học/bài tập/bài trắc nghiệm/dự án cho từng học viên. – Xóa bài học/bài tập/bài trắc nghiệm/dự án cho từng học viên. 
– Phân loại nội dung theo các chủ đề hoặc cấp độ khó khác nhau để phù hợp với từng lộ trình học tập. 
• Xuất báo cáo: 
– Tùy chỉnh các tiêu chí để xuất báo cáo kết quả học tập (theo thời gian, theo bài kiểm tra, theo nhóm học viên mà người dùng chọn). 
– Chọn các định dạng muốn xuất (PDF, Excel) để lưu trữ hoặc gửi đi. 
– Nhận báo cáo nhanh qua email. 
2.2.5 Learning Content Management 
Đối với Admin: 
• Quản lý khóa học: 
– Tạo một khóa học mới. 
– Thay đổi trạng thái của khóa học (public/private). 
• Quản lý phân quyền: 
– Phân quyền khóa học sẽ được giảng viên nào giảng dạy. 
– Chỉ định danh sách học viên có quyền xem khóa học. 
• Theo dõi thành viên khóa học: 
– Xem được danh sách giảng viên tham gia giảng dạy khoa học. 
– Xem danh sách các học viên tham gia khóa học. 
Đối với Học viên 
• Tiếp cận tài liệu học tập: 
– Xem các tài liệu học tập được đăng tải. %item nhận được thông báo khi có bài tập hoặc tài liệu mới. 
Đối với Giảng viên 
• Quản lý tài liệu học tập: 
– Đăng tải tài liệu học tập mới lên môn học mà mình quản lý. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 11/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– Chọn định dạng tài liệu học tập mà mình đăng tải. 
– Xem lại các tài liệu học tập mà mình đã đăng tải lên. 
– Cập nhật lại những tài liệu học tập mà mình đã đăng tải lên. 
– Xoá các tài liệu học tập mà mình đã đăng tải lên. 
– Ẩn/hiện các tài liệu học tập mà mình đã đăng tải. 
• Quản lý diễn đàn khóa học: 
– Tạo một diễn đàn bên trong khóa học. 
– Trả lời câu hỏi hoặc bình luận của học viên trong diễn đàn. 
2.3 Non-functional Requirements 
• Phản hồi nhanh (<2s cho truy vấn chính), xử lý tối thiểu 100 giao dịch/giây và ổn định trong giờ cao điểm. 
• Hỗ trợ mở rộng theo chiều ngang, đáp ứng tăng trưởng người dùng hằng năm và tải đột biến mùa thi. 
• Đảm bảo uptime ≥ 99.9%, có cơ chế failover tự động và phục hồi sự cố trong vài phút; dữ liệu được backup định kỳ. 
• Có thực hiện phân quyền rõ ràng cho từng vai trò của người dùng. 
• Thiết kế module hoá, tuân thủ SOLID, hỗ trợ mở rộng chức năng, dễ bảo trì và có CI/CD; unit test bao phủ ≥ 80%. 
• Giao diện trực quan và yêu cầu bảo mật dữ liệu; thao tác ngắn gọn cho giảng viên và học viên. 
• Hỗ trợ triển khai on-premise và cloud, cập nhật liên tục với downtime < 5 phút. • Khôi phục hệ thống trong ≤ 1 giờ và lưu trữ backup tại nhiều vị trí địa lý. 
• Không chia sẻ dữ liệu khi chưa có sự đồng ý; AI/ML phải minh bạch và học viên có quyền yêu cầu xoá dữ liệu. 
2.4 Outlining 
2.4.1 Scope 
Hệ thống Intelligent Tutoring System (ITS) sẽ được phát triển dưới dạng nền tảng web để đảm bảo dễ dàng truy cập cho học viên, giảng viên và quản trị viên. Nhờ vào cách tiếp cận web-based, hệ thống có thể truy cập từ nhiều thiết bị mà không cần cài đặt phức tạp, giúp quản lý các hoạt động học tập và giảng dạy diễn ra liền mạch. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 12/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
ITS được thiết kế cho các cơ sở giáo dục quy mô vừa, hỗ trợ khoảng 50 - 500 giảng viên và quản lý hoạt động học tập của 500 - 5.000 học viên mỗi ngày. Hệ thống phù hợp đặc biệt với: 
• Các trường đại học và cao đẳng – Cung cấp trải nghiệm học tập cá nhân hóa và thích ứng trên nhiều môn học. 
• Trung tâm đào tạo tư nhân – Quản lý học tập cá nhân, đánh giá, và theo dõi tiến trình học hiệu quả. 
• Các khóa học trực tuyến và nền tảng e-learning – Nâng cao khả năng tiếp cận tài liệu học tập và nội dung tương tác cho học viên. 
Hệ thống ITS hỗ trợ các hoạt động học tập và giảng dạy hiệu quả thông qua các quy trình: 
• Học tập cá nhân hóa – Đánh giá điểm mạnh, điểm yếu, phong cách học của từng học viên để cung cấp nội dung phù hợp. 
• Phản hồi và gợi ý – Học viên nhận được phản hồi về kết quả học tập, bao gồm hướng dẫn và gợi ý khi cần thiết. 
• Đánh giá và kiểm tra – Hệ thống quản lý quiz, bài tập, dự án và đánh giá tiến trình học viên liên tục. 
• Dashboard giảng viên – Giảng viên theo dõi tiến trình học viên, quản lý nội dung và xuất báo cáo. 
• Quản lý nội dung học tập – Tạo, cập nhật và quản lý tài liệu học tập theo các chủ đề và định dạng khác nhau (văn bản, video, bài tập tương tác). 
Mặc dù ITS cải thiện đáng kể hoạt động học tập, có một số hạn chế cần lưu ý: 
• Hệ thống tập trung chính vào học tập cá nhân hóa, đánh giá và theo dõi tiến trình, chưa tích hợp các tính năng quản lý hành chính toàn diện hay giảng dạy trực tiếp qua video. 
• ITS có thể cần tích hợp với các hệ thống quản lý học tập (LMS), hệ thống thông tin sinh viên (SIS), hoặc cơ sở dữ liệu của trường để đạt hiệu quả tối đa. 
2.4.2 Objectives 
Mục tiêu của bài tập này là thiết kế và triển khai một hệ thống Intelligent Tutoring System (ITS) trên nền tảng web, nhằm tối ưu hóa và nâng cao hiệu quả hoạt động giáo dục bằng cách cung cấp một nền tảng tích hợp cho việc quản lý học tập cá nhân hóa, đánh giá, dashboard giảng viên và báo cáo, đồng thời đảm bảo hiệu quả, độ chính xác và khả năng mở rộng. 
Hệ thống ITS giúp tập trung dữ liệu, tự động hóa các quy trình học tập, tăng cường sự phối hợp giữa giảng viên và học viên, giảm bớt gánh nặng quản lý thủ công và hạn chế sai sót. Bằng việc cải thiện khả năng truy cập tài liệu học tập, tối ưu hóa lộ trình học tập cho từng học viên và đảm bảo hoạt động giảng dạy trơn tru, ITS nâng cao hiệu quả giáo dục và kết quả học tập của học viên. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 13/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
3 Tính Chất Kiến Trúc (Architecture Characteristic) 
Để lựa chọn kiến trúc phù hợp cho hệ thống ITS, nhóm xác định các Architecture Char acteristics dựa trên bản chất của một nền tảng hỗ trợ dạy và học trực tuyến với nhiều vai trò người dùng và nhiều module nghiệp vụ hoạt động song song. Các đặc tính này được lựa chọn vì chúng quyết định trực tiếp mức độ thành công của hệ thống trong môi trường vận hành thực tế. 
Thứ nhất, vì ITS phục vụ sinh viên và giảng viên liên tục trong ngày học, các đặc tính vận hành như Availability, Performance, Scalability và Reliability trở nên đặc biệt quan trọng. Chỉ một sự cố nhỏ cũng có thể làm gián đoạn việc truy cập tài liệu, làm bài hoặc nộp bài, ảnh hưởng nghiêm trọng đến trải nghiệm người dùng. Do đó, hệ thống cần đảm bảo hoạt động ổn định, phản hồi nhanh và khả năng mở rộng tốt khi có lượng lớn người dùng truy cập đồng thời. 
Thứ hai, ITS là phần mềm có vòng đời lâu dài trong môi trường học thuật, thường xuyên đối mặt với yêu cầu thay đổi chương trình học, cập nhật phương pháp đánh giá và bổ sung chức năng mới. Vì vậy, các đặc tính phát triển như Maintainability, Extensibility được lựa chọn nhằm đảm bảo hệ thống dễ bảo trì, dễ mở rộng và có thể điều chỉnh các thông số vận hành mà không cần thay đổi mã nguồn. 
Thứ ba, với việc hệ thống quản lý thông tin cá nhân, điểm số và dữ liệu học tập, các đặc tính liên quan đến bảo mật như Security là bắt buộc. Hệ thống cần đảm bảo người dùng được xác thực chính xác, phân quyền rõ ràng theo vai trò và dữ liệu nhạy cảm được bảo vệ an toàn. 
Cuối cùng, vì người sử dụng hệ thống bao gồm sinh viên, giảng viên và quản trị viên — những đối tượng có mức độ thành thạo công nghệ khác nhau — đặc tính Usability được đưa vào để đảm bảo giao diện trực quan, dễ sử dụng và phù hợp với từng vai trò. 
Tổng hợp lại, các Architecture Characteristics trên bao phủ đầy đủ yêu cầu vận hành, bảo mật, khả năng phát triển và trải nghiệm người dùng của toàn bộ ITS. Đây là cơ sở để nhóm tiến hành so sánh các architecture style (Layered, Service-Based, Microservices) và lựa chọn kiến trúc tối ưu nhất cho hệ thống. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 14/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Characteristic 
Description
Availability 
Hệ thống sẵn sàng phục vụ người dùng trong suốt thời gian hoạt động, hạn chế tối đa gián đoạn.
Performance 
Đảm bảo tốc độ phản hồi nhanh cho các thao tác thời gian thực như xem tài liệu, làm bài và nộp bài.
Scalability 
Hỗ trợ mở rộng và thêm mới các chức năng dễ dàng để phục vụ hàng nghìn sinh viên truy cập đồng thời trên nhiều môn học.
Recoverability 
Khôi phục trạng thái làm bài khi xảy ra sự cố và hỗ trợ sao lưu – phục hồi dữ liệu định kỳ.
Maintainability 
Hệ thống dễ bảo trì, sửa lỗi và cập nhật mà không ảnh hưởng đến các module khác.
Extensibility 
Dễ dàng mở rộng hệ thống bằng cách bổ sung chức năng mới mà không cần thay đổi cấu trúc hiện tại.
Security 
Bảo vệ dữ liệu nhạy cảm thông qua mã hóa và các biện pháp an toàn thông tin.
Usability 
Giao diện trực quan, dễ sử dụng, phù hợp với từng loại người dùng trong hệ thống.



Table 2: Tổng hợp Architecture Characteristics của hệ thống ITS 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 15/102

Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4 Kiến trúc hệ thống 
4.1 Kiến trúc phân lớp 
4.1.1 Giới thiệu về kiến trúc phân lớp (Layered Architecture) 
Kiến trúc phân lớp là một trong những kiểu kiến trúc phổ biến nhất. Có thể nói rằng, đây là một tiêu chuẩn thông thường, dễ áp dụng cho hầu hết các phần mềm đơn giản, quen thuộc và có chi phí thấp. 
Trong kiến trúc phân lớp, các lớp được phân vùng theo vai trò kỹ thuật (technically parti tioned). Thay vì được nhóm theo nghiệp vụ, các lớp được nhóm theo vai trò kỹ thuật của chúng trong kiến trúc. Ở kiến trúc phân lớp, không có ràng buộc nhất định cho số lượng lớp có thể. Tuy nhiên, thông thường thì các kiến trúc phân lớp có 4 lớp lần lượt là: presentation, business, persistence và database như hình dưới. 

Figure 1: Cấu trúc cơ bản của kiến trúc phân lớp 
Ưu điểm của kiến trúc phân lớp: 
• Đơn giản nhất để phát triển và triển khai. 
• Dễ quản lý mã nguồn vì mọi thành phần nằm trong một codebase. 
• Dễ đảm bảo tính nhất quán của dữ liệu vì dùng chung một cơ sở dữ liệu. Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 16/102

Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.1.2 Sự phù hợp với ITS 

Figure 2: Bảng đánh giá kiến trúc phân lớp 
Nếu triển khai ITS theo kiến trúc phân tầng thuần túy, toàn bộ các module như User Management, Learning Content, Assessment và User Management sẽ nằm chung trong một ứng dụng đơn khối. Cách tiếp cận này giúp việc phát triển ban đầu đơn giản, dễ quản lý codebase và phù hợp với nhóm nhỏ. Tuy nhiên, khi số lượng học viên và chức năng tăng lên, việc mở rộng hiệu năng hoặc triển khai độc lập từng module (ví dụ: scale riêng Assessment trong mùa thi) sẽ gặp nhiều hạn chế. Điều này khiến Layered Architecture chưa đáp ứng tốt các đặc tính Scalability mà hệ thống ITS yêu cầu. 
4.2 Kiến trúc vi dịch vụ 
4.2.1 Giới thiệu về kiến trúc vi dịch vụ (Microservices Architecture) 
Kiến trúc vi dịch vụ là một kiểu kiến trúc phổ biến, đã và đang được sử dụng rộng rãi trong những năm gần đây. Kiến trúc vi dịch vụ là một kiến trúc tập trung vào miền (domain-centered) hay phân vùng theo miền (domain-partitioned) ở mức độ tối đa, mỗi dịch vụ cố gắng mô hình hóa một miền hoặc quy trình nghiệp vụ. Kiến trúc vi dịch vụ là một kiến trúc phân tán, mỗi dịch vụ (service) chạy trong một không gian tiếng trình riêng của nó và không phụ thuộc với 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 17/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
nhau. 
Kiến trúc vi dịch vụ được ra đời với mục tiêu là đạt được mức độ tách rời (decoupling) cao. Kiến trúc vi dịch vụ ưu tiện việc nhân bản (duplication) hơn là tái sử dụng (reuse) để tránh có sự kết nối giữa các thành phần với nhau. 

Figure 3: Cấu trúc cơ bản của kiến trúc phân lớp 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 18/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.2.2 Sự phù hợp với ITS 

Figure 4: Bảng đánh giá kiến trúc vi dịch vụ 
Nếu áp dụng kiến trúc vi dịch vụ, mỗi domain như User Management, Learning Content Management, Assessment Evaluation & Feedback, Recommendation có thể trở thành một service độc lập với cơ sở dữ liệu và pipeline triển khai riêng. Điều này mang lại khả năng Scalability và Recoverability rất cao, đồng thời cho phép các nhóm phát triển khác nhau làm việc độc lập. Tuy nhiên, đối với hệ thống ITS quy mô vừa, kiến trúc này đòi hỏi chi phí vận hành, giám sát, logging, tracing và DevOps lớn hơn rất nhiều so với nhu cầu hiện tại. Độ phức tạp tăng lên ở các khía cạnh như quản lý giao dịch phân tán, nhất quán dữ liệu và bảo trì hạ tầng, dẫn đến Overall Cost và Simplicity thấp trong bảng đánh giá. 
4.3 Kiến trúc dựa trên dịch vụ (Service-based Architecture) 4.3.1 Giới thiệu về kiến trúc dựa trên dịch vụ (Service-based Architecture) 
Kiến trúc dựa trên dịch vụ là một kiểu kiến trúc phân tán (distributed architecture) và là một kiểu kiến trúc lai của kiến trúc microservices. Mặc dù là một kiểu kiến trúc phân tán, nhưng kiểu kiến trúc này ít phức tạp và tốn ít chi phí hơn kiến trúc vi dịch vụ, khiến nó trờ thành lựa chọn rất phổ biến cho nhiều ứng dụng. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 19/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Cấu trúc cơ bản của kiến trúc dựa trên dịch vụ gồm 3 phần chính bao gồm giao diện người dùng (User Interface), các dịch vụ (Services) và một khối cơ sở dữ liệu (monolithic database). Trong đó, 3 phần này được triển khai độc lập với nhau. Ở phần dịch vụ (Services), các dịch vụ cũng được triển khai độc lập với nhau. Thêm vào đó, ở bên trong mỗi dịch vụ sẽ được thiết kế theo kiểu kiến trúc monolith (thông thường là kiến trúc phân lớp). 

Figure 5: Cấu trúc cơ bản của kiến trúc dựa trên dịch vụ 
4.3.2 Sự phù hợp với ITS 

Figure 6: Bảng đánh giá kiến trúc dựa trên dịch vụ 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 20/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Với kiến trúc dựa trên dịch vụ, hệ thống ITS được chia thành các service theo domain nghiệp vụ như User Management, Learning Content Management, Assessment and Feedback, Personalized Learning và Instructor Dashboard. Mỗi service có thể triển khai độc lập, nhưng vẫn chia sẻ một cơ sở dữ liệu chung, giúp giảm độ phức tạp vận hành so với microservices. Cách tiếp cận này vừa giữ được tính đơn giản và chi phí hợp lý như Layered Architecture, vừa cải thiện rõ rệt các đặc tính Scalability, Deployability, Testability và Maintainability trong bảng đánh giá. 
4.4 Chọn lựa kiến trúc hệ thống phù hợp 
Trong quá trình phân tích các kiến trúc phù hợp cho hệ thống ITS, nhóm đã cân nhắc ba kiến trúc phổ biến: kiến trúc tầng (Layered Architecture), kiến trúc vi dịch vụ (Microservices Architecture) và kiến trúc dựa trên dịch vụ ở mức trung gian (Service-Based Architecture). Mỗi kiến trúc đều sở hữu những ưu điểm riêng: Layered Architecture đơn giản và dễ triển khai; Microservices mang lại khả năng mở rộng độc lập và linh hoạt; trong khi SBA giữ vai trò cân bằng giữa tính mô-đun và độ phức tạp vận hành. 
Dựa trên các đặc tính kiến trúc (Architecture Characteristics) của đã được nêu ở bảng 2 thì nhóm thấy rằng kiểu kiến trúc dựa trên dịch vụ (Service-Based Architecture) thể hiện sự phù hợp cao nhất. 
Thứ nhất, kiến trúc dựa trên dịch vụ cho phép chia hệ thống thành các service theo domain nghiệp vụ như Learning Content Management, Learner Profile, Assessment và Analytics. Việc tách rời này giúp nâng cao availability và performance, vì mỗi service có thể được tối ưu và vận hành độc lập. Đồng thời, khả năng recoverability cũng được cải thiện, do sự cố của một service không ảnh hưởng toàn bộ hệ thống. 
Thứ hai, kiến trúc dựa trên dịch vụ hỗ trợ scalability tốt hơn so với kiến trúc tầng truyền thống. Những service có tải cao như Assessment trong mùa thi có thể được mở rộng độc lập, đáp ứng nhu cầu hàng nghìn sinh viên truy cập đồng thời mà không làm tăng tải cho toàn hệ thống. 
Thứ ba, xét về khía cạnh phát triển, kiến trúc dựa trên dịch vụ mang lại tính maintain ability và extensibility cao. Các thay đổi hoặc mở rộng chức năng chỉ tác động lên một phần hệ thống, giúp giảm rủi ro, tăng tốc độ phát triển và hỗ trợ configurability tốt hơn khi mỗi service có thể quản lý cấu hình riêng. 
Cuối cùng, kiến trúc dựa trên dịch vụ phù hợp với các yêu cầu về security, authentication và authorization nhờ ranh giới rõ ràng giữa các service, giúp kiểm soát truy cập theo từng domain. Kiến trúc này cũng hỗ trợ việc thiết kế API và giao diện rõ ràng, nâng cao usability và đảm bảo trải nghiệm người dùng nhất quán. 
Với sự cân bằng giữa khả năng mô-đun hóa, hiệu năng, khả năng mở rộng và tính đơn giản trong triển khai, kiến trúc dựa trên dịch vụ (Service-Based Architecture) trở thành kiến trúc tối ưu cho ITS với nhu cầu là một hệ thống giáo dục có nhiều module nghiệp vụ, nhiều vai trò người dùng và yêu cầu vận hành ổn định. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 21/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.5 Module View 
4.5.1 Tổng quan 
Figure 7: Cấu trúc tổng quát của Package Diagram 
Hình trên là sơ đồ tổng quát của Package Diagram cho hệ thống ITS, gồm các tầng như Frontend Interface là giao diện của người dùng. Người dùng sẽ gửi yêu cầu tới hệ thống. Sau đó, yêu cầu của người dùng sẽ được sẽ được gửi tới hệ thống ITS. Yêu cầu của người dùng sẽ được đi qua một lớp gọi là API Gateway và sẽ đo tới các service bên dưới sau lớp API Gateway. Có tổng cộng 4 Service chính: 
• Personalized Learning Module 
• Assessment and Evaluation Module 
• Learning Content Management Module 
• Instructor Dashboard Module 
Trong mỗi service, chúng được thiết kế dựa trên kiến trúc phân lớp (Layered Architecture), có tổng cộng 3 lớp chính lần lượt là Presenttaion Layer, Business Layer và Persistence Layer. 
4.5.2 User Module 
User Module chịu trách nhiệm quản lý người dùng, xác thực và phân quyền trong toàn bộ hệ thống ITS. Module này là nền tảng cho các service khác khi xử lý logic liên quan đến người dùng. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 22/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 

Figure 8: Package Diagram của User Module 
1. Presentation Layer 
UserManagementFacade đóng vai trò là điểm truy cập duy nhất cho các thao tác của người dùng từ giao diện frontend. Facade này tiếp nhận các request như đăng ký, đăng nhập, cập nhật hồ sơ, kiểm tra quyền truy cập và chuyển tiếp các thao tác này xuống các service tương ứng ở tầng nghiệp vụ. 
Nhiệm vụ chính của tầng này là chuẩn hóa request/response và che giấu sự phức tạp của các service bên dưới. 
2. Business Layer 
• User Management Service: Quản lý vòng đời tài khoản người dùng, bao gồm các thao tác: tạo tài khoản mới, chỉnh sửa thông tin người dùng, thay đổi mật khẩu, cập nhật vai trò và trạng thái hoạt động. 
• Authentication Service: Thực hiện các nhiệm vụ xác thực: đăng nhập, đăng xuất, cấp và xác minh JWT, làm mới token. Service này được tích hợp trực tiếp với API Gateway để bảo vệ các tài nguyên nội bộ. 
• User Service: Cung cấp các chức năng truy vấn thông tin người dùng như tìm kiếm, lọc theo vai trò, xem hồ sơ cá nhân và truy xuất thông tin cần thiết cho các module khác (ví dụ Personalized Learning hoặc Dashboard). 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 23/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
3. Persistence Layer 
Tầng này chịu trách nhiệm lưu trữ và truy vấn dữ liệu người dùng thông qua UserReposi tory. Repository quản lý các entity như User, Role và UserProfile, đồng thời cung cấp các CRUD method tiêu chuẩn để phục vụ business layer. 
4.5.3 Personalized Learning Module 
Personalized Learning Module cung cấp toàn bộ logic liên quan đến cá nhân hóa lộ trình học, gợi ý nội dung và phân tích tiến độ học tập của từng học viên. 

Figure 9: Package Diagram của Personalized Learning Module 
1. Presentation Layer 
Lớp giao tiếp chính nhận request từ học viên như xem lộ trình học, yêu cầu gợi ý nội dung tiếp theo, xem báo cáo học tập hoặc ghi nhận hoàn thành bài học. Facade này giúp các API trở nên thống nhất và dễ sử dụng, mặc dù logic nội bộ phức tạp. 
2. Business Layer 
• Insight Service: Xử lý và tổng hợp dữ liệu để tạo báo cáo học tập theo từng học viên hoặc cả lớp học. Service này cung cấp các phân tích như mức độ thành thạo, tiến độ và hiệu suất học tập. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 24/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Plan Service: Chịu trách nhiệm tạo mới hoặc cập nhật Study Plan, dựa trên mục tiêu học tập, lịch sử và mức độ thành thạo của học viên. Service này cũng hỗ trợ điều chỉnh lộ trình khi học viên tiến bộ. 
• Progress Service: Theo dõi tiến độ học tập: ghi nhận các nội dung đã hoàn thành, cập nhật mastery và lưu trạng thái học tập theo thời gian thực. 
• Recommendation Service: Đưa ra đề xuất “Next Best Activity” dựa trên thuật toán thích ứng. Service sử dụng thông tin mastery, độ khó nội dung và mối quan hệ prerequisite để chọn hoạt động phù hợp nhất. 
3. Persistence Layer 
Bao gồm các repository quản lý dữ liệu của module như RecommendationRepository, Pro gressRepository, PlanRepository và InsightRepository. Các repository này lưu trữ những entity như StudyPlan, MasteryState, Progress, PlanItem, Recommendation và Report. 
4.5.4 Assessment and Evaluation Module 
Module này quản lý toàn bộ quy trình đánh giá: tạo bài đánh giá, thực hiện bài làm, chấm điểm và trả phản hồi cho học viên. 

Figure 10: Package Diagram của Assessment and Evaluation Module 
1. Presentation Layer 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 25/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
AssessmentModuleFacade đóng vai trò là điểm vào duy nhất cho tất cả các thao tác liên quan đến bài đánh giá từ giảng viên và học viên. Facade này xử lý các yêu cầu như tạo bài kiểm tra, thêm câu hỏi, bắt đầu bài làm, lưu câu trả lời, xin gợi ý, chấm điểm và xem kết quả. 
2. Business Layer 
• Grading Service: Chấm điểm tự động cho các câu hỏi khách quan, hỗ trợ chấm thủ công đối với câu hỏi tự luận và tính toán điểm tổng hợp cuối cùng. 
• AssessmentTaker Service: Xử lý luồng làm bài của học viên: khởi tạo phiên làm bài, lưu câu trả lời theo thời gian thực và xử lý việc nộp bài. 
• AssessmentCreator Service: Dành cho giảng viên tạo và chỉnh sửa bài đánh giá: thêm câu hỏi, cập nhật cấu hình bài kiểm tra, quy định phản hồi và quản lý nội dung đánh giá. 
• Feedback Service: Quản lý logic phản hồi (hint, explanation, full review) và kiểm tra quyền hiển thị dựa trên cấu hình của mỗi bài đánh giá. 
3. Persistence Layer 
Gồm các repository như AssessmentRepository, SubmissionRepository, ResultRepository, lưu trữ toàn bộ dữ liệu như Assessment, Submission, Answer, Result, AssessmentQuestion, FeedbackConfig và các enum liên quan. 
4.5.5 Learning Content Management Module 
Module này chịu trách nhiệm quản lý khóa học, tài liệu học tập và bài tập do giảng viên hoặc admin đăng tải. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 26/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 

Figure 11: Package Diagram của Learning Content Management Module 
1. Presentation Layer 
Lớp giao tiếp nhận yêu cầu từ Admin, Giảng viên hoặc Học viên như xem tài liệu, tải tài liệu, tạo khóa học, phân quyền, chỉnh sửa bài tập và quản lý diễn đàn khóa học. Đây là cửa ngõ duy nhất xử lý toàn bộ tác vụ quản lý nội dung. 
2. Business Layer 
• CourseInstance Service: Quản lý phiên bản lớp học: danh sách học viên, giảng viên, trạng thái khóa học và các phiên bản giảng dạy theo học kỳ. 
• Course Service: Quản lý thông tin tổng thể của khóa học như tiêu đề, mô tả, mục tiêu học tập và cấu trúc chương/mục. 
• Content Service: Quản lý tài liệu học tập, bao gồm đăng tải, chỉnh sửa, xóa, ẩn/hiện tài liệu; tạo bài tập cũng như xử lý dữ liệu bài nộp và diễn đàn khóa học. 
3. Persistence Layer 
Gồm các repository lưu trữ dữ liệu khóa học, tài liệu học tập và bài tập như CourseRepos itory, ContentRepository và CourseInstanceRepository. 
4.5.6 Instructor Dashboard Module 
Instructor Dashboard Module cung cấp các công cụ phân tích và quản lý nội dung phục vụ giảng viên trong quá trình giảng dạy. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 27/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 

Figure 12: Package Diagram của Instructor Dashboard Module 
1. Presentation Layer 
FacadeInstructorDashboard là điểm giao tiếp trung tâm cho tất cả chức năng của giảng viên. Tầng này tiếp nhận request như xem tiến độ học viên, tạo nội dung mới hoặc xuất báo cáo. Đồng thời nó chuẩn hóa dữ liệu trả về để hiển thị trực quan trên giao diện dashboard. 
2. Business Layer 
• Progress Monitor Service: Truy vấn và tổng hợp dữ liệu tiến độ học tập của học viên, tạo biểu đồ, thống kê và các chỉ số hiệu suất giúp giảng viên theo dõi tình trạng lớp học. 
• Content Editor Service: Cho phép giảng viên quản lý tài liệu học tập: tạo, cập nhật, xóa nội dung và gán nội dung cho học viên hoặc lớp học với thời hạn tùy chọn. • Report Generator Service: Tạo báo cáo dựa trên tiêu chí giảng viên cung cấp và xuất ra các định dạng như PDF hoặc Excel, sử dụng pattern Strategy thông qua các formatter. 
3. Persistence Layer 
Bao gồm các repository như StudentRepository, ContentRepository và LearningAnalytic sRepository, lưu dữ liệu phục vụ cho việc phân tích, quản lý nội dung và sinh báo cáo trong dashboard của giảng viên. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 28/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.6 Component and Connector View 
Figure 13: Component diagram của hệ thống 
4.6.1 Mô tả 
Sơ đồ Component & Connector (C&C) mô tả kiến trúc của Hệ thống Intelligent Tutoring System (ITS), được tổ chức theo các thành phần mô-đun, giao diện rõ ràng và các connector tương tác giữa chúng. Mỗi module bao gồm các service nội bộ, các facade quản lý giao tiếp và các cổng vào/ra (ports). Toàn bộ luồng trao đổi dữ liệu tuân thủ mô hình giao tiếp dựa trên interface, đảm bảo phân tách rõ ràng trách nhiệm và giảm độ phụ thuộc giữa các thành phần. 
4.6.1.1 Clients. Hệ thống được truy cập bởi ba nhóm người dùng chính: • Admin – tương tác với User Management và Course Management. 
• Giảng viên (Teacher) – sử dụng Learning Content Management, Assessment Manage ment và Course Instance Management. 
• Sinh viên (Student) – sử dụng Program Navigation, Learning Content Consumption và Assessment Submission. 
Mỗi nhóm chỉ được phép truy cập thông qua các facade tương ứng với vai trò của họ, đảm bảo đúng phạm vi quyền hạn và an toàn hệ thống. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 29/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.6.1.2 Thành phần User Management. Thành phần này quản lý người dùng, vai trò, xác thực và phân quyền. Bao gồm: 
• UserService 
• RoleService 
• AuthenticationService 
Tất cả được đóng gói dưới UserManagementFacade. Mỗi service truy cập dữ liệu thông qua repository tương ứng, tuân thủ mô hình phân tầng. 
4.6.1.3 Thành phần Learning Content Management. Quản lý nội dung học tập và tài liệu. Bao gồm: 
• LearningContentService 
• AttachmentService 
• ContentVersioningService 
Luồng giao tiếp ra ngoài đi qua LearningContentFacade. Các service phụ thuộc vào Con tentRepository và AttachmentRepository. 
4.6.1.4 Thành phần Course & Course Instance Management. Quản lý chương trình học phần, lớp học và phân công giảng viên: 
• CourseService 
• CourseInstanceService 
• EnrollmentService 
Các cổng giao tiếp được phơi bày thông qua CourseManagementFacade. Toàn bộ dữ liệu được lấy từ repository chuyên biệt. 
4.6.1.5 Thành phần Assessment Management. Xử lý bài kiểm tra, bài nộp và chấm điểm: 
• AssessmentService 
• SubmissionService 
• GradingService 
Tương tác ra ngoài được chuẩn hóa qua AssessmentManagementFacade. Các service truy cập repository tương ứng của mình. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 30/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.6.1.6 Thành phần Program Structure & Navigation. Quản lý cấu trúc chương trình học và định hướng lộ trình học tập: 
• ProgramService 
• ModuleService 
• LearningPathService 
Các cổng kết nối được quản lý thông qua ProgramManagementFacade, hỗ trợ sinh viên điều hướng chương trình học hợp lý. 
4.6.1.7 Thành phần Reporting & Analytics. Cung cấp báo cáo và phân tích tiến độ: • LearningProgressService 
• CompletionTrackingService 
• AnalyticsCompilationService 
Toàn bộ giao tiếp với các module khác đi qua ReportingFacade, giúp tổng hợp dữ liệu từ chương trình, đánh giá và người dùng. 
4.6.1.8 Thành phần Data Access & Repository Gateway. Tất cả các module đều tương tác với tầng dữ liệu thông qua thành phần Data Access. Đây là thành phần duy nhất kết nối trực tiếp với cơ sở dữ liệu. Cách tiếp cận này: 
• đảm bảo một điểm truy cập duy nhất vào database, 
• duy trì tính nhất quán dữ liệu, 
• ngăn chặn truy cập trực tiếp trái phép từ các module khác. 
4.6.1.9 Nhận xét kiến trúc. 
• Giao tiếp giữa các module tuân theo mô hình PortOut → Interface → PortIn. • Mỗi module chỉ phơi bày một facade để chuẩn hóa và giảm độ phức tạp khi tương tác. • Số lượng ports được tối thiểu hóa để đảm bảo an toàn và tránh rò rỉ dữ liệu. • Clients được phân tách rõ ràng, mỗi nhóm truy cập qua đúng facade theo vai trò. • Thiết kế hướng mô-đun giúp mở rộng dễ dàng mà không ảnh hưởng đến các module khác. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 31/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4.7 Allocation View 
Figure 14: Deployment Diagram của hệ thống 
Deployment Diagram của hệ thống ITS trình bày kiến trúc triển khai thực tế của ứng dụng trong môi trường production, thể hiện cách các thành phần phần mềm được phân bố trên các node phần cứng và môi trường thực thi, cùng với các ràng buộc bảo mật và luồng giao tiếp giữa chúng. Kiến trúc được thiết kế theo mô hình service-based, vận hành trên hạ tầng máy chủ ảo VPS duy nhất. 
Toàn bộ hệ thống được đóng gói trong môi trường Docker, với dữ liệu được lưu trữ bền vững trên nền tảng đám mây MongoDB Atlas. Quy trình phát triển và vận hành được tự động hóa hoàn toàn thông qua chuỗi CI/CD, đảm bảo tính nhất quán từ môi trường development đến production. 
Hệ thống bao gồm các node chính sau: 
1. Client Device: Tại phía người dùng cuối (sinh viên và giảng viên), hệ thống được truy cập thông qua các trình duyệt web tiêu chuẩn (như Chrome, Microsoft Edge...). Thành phần chủ yếu là ITS Single Page Application (SPA) - một ứng dụng React.js đóng vai trò là giao diện tương tác chính, chịu trách nhiệm render dữ liệu và gửi các yêu cầu xử lý (requests) về máy chủ. 
2. VPS Server Node: Đây là node trung tâm chịu trách nhiệm vận hành toàn bộ logic Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 32/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
nghiệp vụ. Nó hoạt động trên môi trường Linux và được bảo vệ bởi lớp Firewall, đảm nhận vai trò kiểm soát lưu lượng truy cập. 
Nginx Gateway: Nginx Gateway được triển khai trực tiếp trên hệ điều hành của VPS và nằm ngoài Docker Engine. Mọi yêu cầu từ Internet đều phải đi qua container này. Nó hoạt động như một Reverse Proxy kiêm Load Balancer, có nhiệm vụ điều hướng traffic: các yêu cầu lấy giao diện sẽ được chuyển đến Frontend Container, trong khi các yêu cầu dữ liệu sẽ được chuyển tiếp vào các Backend Container. 
Bên trong VPS, Docker Engine được sử dụng làm môi trường thực thi chính cho container frontend và toàn bộ các cotainer Java backend. 
• Frontend Container: Chứa mã nguồn React đã được biên dịch. 
• User Service Container: Đăng nhập, đăng ký, quản lý thông tin người dùng. • Learning Content Service Container: Quản lý nội dung học tập đa phương tiện. 
• Assessment Service Container: Xử lý các bài kiểm tra và đánh giá năng lực học viên. 
• Progress Tracking Service: Theo dõi tiến độ, hành vi học tập và đưa ra phản hồi, gợi ý cá nhân hóa. 
3. MongoDB Atlas: Cơ sở dữ liệu được lưu trữ trên MongoDB Atlas, cung cấp các lợi ích về tính sẵn sàng cao, backup tự động và cluster phân tán. Các backend services kết nối tới MongoDB Cluster để thao tác với các schema như Users, Content... 
4. CI/CD Environment: Quy trình triển khai hệ thống được tự động hóa thông qua GitHub Actions, tự động build, đóng gói docker và triển khai lên VPS mỗi khi có cập nhật mã nguồn. 
5. SMTP Email Service: Hệ thống sử dụng dịch vụ gửi email thông qua giao thức SMTP, được triển khai bởi thư viện Nodemailer, để thực hiện các tác vụ gửi email thông báo và báo cáo học tập, đảm bảo độ tin cậy cao trong việc phân phối thông tin. 
Tương tác giữa các node: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 33/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Node 1 Node 2 Protocol/Label Client Device Firewall Hypertext Transfer Protocol Secure Firewall Nginx Gateway Container Hypertext Transfer Protocol Secure Nginx Gateway Container Frontend Container Hypertext Transfer Protocol Nginx Gateway Container User Service Container REST API Nginx Gateway Container Learning Content Service Container REST API Nginx Gateway Container Assessment Service Container REST API Nginx Gateway Container Progress Tracking Service Container REST API Backend Service Containers MongoDB Atlas MongoDB Protocol Progress Tracking Service Container SMTP Email Server Simple Mail Transfer Protocol Github Actions CI/CD Firewall Secure Shell Firewall Docker Engine Secure Shell 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 34/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
5 Class Diagram 
5.1 User Management Module 
Figure 15: Biểu đồ lớp Class Diagram của module User Management 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 35/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
1. UserManagementFacade (Class) 
• Thuộc tính: 
– - userManagementService: UserManagementService 
– - authenticationService: AuthenticationService 
– - userService: UserService 
• Phương thức: 
– + deleteUser(userName): void 
– + activateAccount(userName): void 
– + deactivateAccount(userName): void 
– + assignRole(user, role, by): void 
– + checkRole(user): void 
– + getUserList(): void 
– + login(username, password): void 
– + logout(): void 
– + register(email, first, last, pass): void 
– + updateUserProfile(username): void 
– + changePassword(old, new): void 
– + resetPassword(code, new): void 
– + getProfile(user): void 
• Vai trò: Facade Pattern - Cung cấp một giao diện thống nhất và đơn giản hóa cho các client để tương tác với hệ thống, che giấu sự phức tạp của các service bên dưới. 
• Tương tác: 
– Gọi xuống UserManagementService cho quản lý user. 
– Gọi xuống AuthenticationService cho xác thực. 
– Gọi xuống UserService cho thông tin cá nhân. 
2. UserManagementService (Class) 
• Thuộc tính: 
– - userRepo: IUserRepository 
– - roleRepo: IRoleRepository 
• Phương thức: 
– + deleteUser(userName): void 
– + activateAccount(userName): void 
– + deactivateAccount(userName): void 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 36/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + assignRole(user, role, by): void 
– + checkRole(user): void 
– + getUserList(): void 
• Vai trò: Xử lý nghiệp vụ quản trị viên: quản lý trạng thái tài khoản và phân quyền người dùng. 
• Tương tác: Sử dụng IUserRepository (và ngầm định IRoleRepository dựa trên thuộc tính). 
3. AuthenticationService (Class) 
• Thuộc tính: 
– - userRepo: IUserRepository 
• Phương thức: 
– + login(username, password): void 
– + logout(): void 
– + register(email, first, last, pass): void 
• Vai trò: Chuyên biệt xử lý logic đăng nhập, đăng xuất và đăng ký tài khoản mới. • Tương tác: Sử dụng IUserRepository để truy vấn và lưu thông tin user. 
4. UserService (Class) 
• Thuộc tính: 
– - userRepo: IUserRepository 
• Phương thức: 
– + updateUserProfile(username): void 
– + changePassword(old, new): void 
– + resetPassword(code, new): void 
– + getProfile(user): void 
• Vai trò: Xử lý các nghiệp vụ liên quan đến chỉnh sửa thông tin cá nhân của người dùng. 
• Tương tác: Sử dụng IUserRepository. 
5. IUserRepository (Interface) 
• Kế thừa: Extends Repository. 
• Phương thức: 
– + save(entity): User 
– + saveAll(entities): List<User> 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 37/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + findById(id): User 
– + count(): long 
– + existById(id): boolean 
– + deleteAll(): void 
– + deleteById(id): void 
– + findAll(): List<User> 
– + findUserByEmail(email: string): User 
– + existByEmail(email: string): boolean 
– + findByRole(role: string): List<User> 
– + findByStatus(status: string): List<User> 
– + findByEmail(email: string): List<User> 
• Vai trò: Interface định nghĩa các phương thức thao tác với database cụ thể cho Entity User. 
• Tương tác: Trả về đối tượng User. 
6. Repository (Interface) 
• Vai trò: Interface Generic cơ sở cho các Repository khác (Pattern Generic Reposi tory). 
• Phương thức: 
– + save(entity): Entity 
– + saveAll(entities): List<Entity> 
– + findById(id): Entity 
– + findAll(): List<Entity> 
– + deleteById(id): void 
– + deleteAll(): void 
– + existById(id): boolean 
– + count(): long 
7. User (Class - Entity) 
• Thuộc tính: 
– - id: string 
– - firstName: string 
– - lastName: string 
– - emai: string (email) 
– - role: Role 
– - status: string 
• Vai trò: Đối tượng POJO/Entity đại diện cho bảng User trong cơ sở dữ liệu. Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 38/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
5.2 Personalized Learning Module 
Figure 16: Biểu đồ lớp Class Diagram của module Personalized Learning 
1. PersonalizedLearningFacade (Class) 
• Thuộc tính: 
– - recommendationService: RecommendationService 
– - progressService: ProgressService 
– - planService: PlanService 
– - insightService: InsightService 
• Phương thức: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 39/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + enrollLearner(learnerId: UUID): void 
– + generateStudyPlan(learnerId: UUID): StudyPlan 
– + getNextActivity(learnerId: UUID): ContentItem 
– + recordCompletion(learnerId: UUID, itemId: UUID): void 
– + submitAttempt(assessmentId: UUID, attempt: any): void 
– + revisePlan(learnerId: UUID): StudyPlan 
– + getLearnerDashboard(learnerId: UUID): Dashboard 
• Vai trò: Facade/Controller điều phối toàn bộ luồng Personalized Learning. • Tương tác: 
– Gọi RecommendationService để chọn hoạt động kế tiếp. 
– Gọi ProgressService để ghi nhận tiến độ & cập nhật mastery. 
– Gọi PlanService để sinh/điều chỉnh StudyPlan. 
– Gọi InsightService để lấy báo cáo cho dashboard. 
2. Repository (Abstract Class) 
• Thuộc tính: (không) 
• Phương thức: 
– + get(id: UUID): Entity 
– + save(entity: Entity): void 
– + delete(id: UUID): void 
– + list(): Entity[] 
• Vai trò: Lớp nền tảng cho mọi repository; định nghĩa CRUD chuẩn. 
• Tương tác: Được kế thừa bởi các repository theo từng service. 
3. RecommendationService (Class) 
• Thuộc tính: (không) 
• Phương thức: 
– + recommendNext(learnerId: UUID): ContentItem 
– + adjustDifficulty(learnerId: UUID, topic: string): void 
• Vai trò: Trả về “next best activity” cho người học. 
• Tương tác: Phụ thuộc IRecommendationRepository. 
4. ProgressService (Class) 
• Phương thức: 
– + getProgress(learnerId: UUID): Progress 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 40/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + recordCompletion(learnerId: UUID, itemId: UUID): void 
– + getMastery(learnerId: UUID, topic: string): MasteryState 
– + upsertMastery(learnerId: UUID, topic: string, state: MasteryState): void • Vai trò: Quản lý tiến độ và mức độ nắm vững (mastery). 
• Tương tác: Phụ thuộc IProgressRepository. 
5. PlanService (Class) 
• Phương thức: 
– + createPlan(learnerId: UUID): StudyPlan 
– + revisePlan(learnerId: UUID): StudyPlan 
• Vai trò: Sinh & điều chỉnh kế hoạch học tập cá nhân. 
• Tương tác: Phụ thuộc IPlanRepository. 
6. InsightService (Class) 
• Phương thức: 
– + classReport(courseId: UUID): Report 
– + learnerReport(learnerId: UUID): Report 
• Vai trò: Tổng hợp chỉ số/báo cáo cho lớp học và từng người học. 
• Tương tác: Phụ thuộc IInsightRepository. 
7. IRecommendationRepository (Interface) & RecommendationRepository (Class) 
• Kế thừa: IRecommendationRepository → Repository; RecommendationRepository implements IRecommendationRepository. 
• Phương thức (cả Interface & Class): 
– + get(id): Entity, + save(entity): void, + delete(id): void, + list(): Entity[] – + recommendNext(learnerId): ContentItem 
• Vai trò: Truy xuất Recommendation và chọn ứng viên tiếp theo. 
• Quan hệ dữ liệu: RecommendationRepository manages Recommendation. 8. IProgressRepository (Interface) & ProgressRepository (Class) 
• Kế thừa: IProgressRepository → Repository; ProgressRepository implements IProgressRepository. 
• Phương thức (cả Interface & Class): 
– + get/save/delete/list như Repository 
– + getMastery(learnerId, topic): MasteryState 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 41/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + upsertMastery(learnerId, topic, state): void 
• Vai trò: Lưu trữ tiến độ và các MasteryState. 
• Quan hệ dữ liệu: ProgressRepository manages Progress; Progress 1–N MasteryState. 9. IPlanRepository (Interface) & PlanRepository (Class) 
• Kế thừa: IPlanRepository → Repository; PlanRepository implements IPlanRepository. • Phương thức (cả Interface & Class): 
– + get/save/delete/list như Repository 
– + createPlan(learnerId): StudyPlan 
– + revisePlan(learnerId): StudyPlan 
• Vai trò: Quản lý StudyPlan. 
• Quan hệ dữ liệu: StudyPlan 1–N PlanItem. 
10. IInsightRepository (Interface) & InsightRepository (Class) 
• Kế thừa: IInsightRepository → Repository; InsightRepository implements IInsightRepository. 
• Phương thức (cả Interface & Class): 
– + get/save/delete/list như Repository 
– + classReport(courseId): Report 
– + learnerReport(learnerId): Report 
• Vai trò: Tổng hợp Report phục vụ dashboard/analytics. 
11. Entity (Base Class) 
• Thuộc tính: + id: UUID 
• Vai trò: Lớp gốc cho mọi thực thể. 
12. Recommendation (Entity) 
• Thuộc tính: + learnerId: UUID, + suggestedContent: ContentItem 
• Quan hệ: 1–1 với ContentItem (mục tiêu được đề xuất). 
13. Progress (Entity) 
• Thuộc tính: + learnerId: UUID, + completed: int, + mastery: MasteryState[] • Quan hệ: 1–N MasteryState. 
14. StudyPlan (Entity) 
• Thuộc tính: + learnerId: UUID, + items: PlanItem[], + status: PlanStatus Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 42/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Quan hệ: 1–N PlanItem. 
15. Report (Entity) 
• Thuộc tính: + courseId: UUID, + learnerId: UUID 
16. ContentItem (Entity) 
• Thuộc tính: + title: string, + difficulty: Difficulty 
• Quan hệ: 1–1 Difficulty. 
17. MasteryState (Entity) 
• Thuộc tính: + topic: string, + confidence: float 
18. PlanItem (Entity) 
• Thuộc tính: + contentId: UUID, + dueDate: datetime, + status: ItemStatus • Quan hệ: 1–1 ItemStatus. 
19. Difficulty (Enumeration) 
• Giá trị: EASY, MEDIUM, HARD 
• Liên kết: ContentItem 1–1 Difficulty. 
20. ItemStatus (Enumeration) 
• Giá trị: PENDING, DUE, DONE 
• Liên kết: PlanItem 1–1 ItemStatus. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 43/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
5.3 Assessment and Feedback Module 
Figure 17: Biểu đồ lớp Class Diagram của module Assessment and Feedback 
1. AssessmentModuleFacade (Class) 
• Thuộc tính: 
– - creatorService: IAssessmentCreator 
– - takerService: IAssessmentTaker 
– - gradingService: IGradingService 
– - feedbackService: FeedbackService 
• Phương thức: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 44/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + createAssessment(config: AssessmentConfigDTO): Assessment 
– + addQuestionToAssessment(assessmentId: UUID, question: AssessmentQuestion): void 
– + getSubmissionsForGrading(assessmentId: UUID): List<Submission> – + saveManualGrade(answerId: UUID, score: float, feedback: String): void – + getMyAssessments(studentId: UUID): List<Assessment> 
– + startAssessment(assessmentId: UUID, studentId: UUID): Submission – + submitAssessment(submissionId: UUID): Submission 
– + getMyResult(submissionId: UUID): Result 
– + setQuestionHintandExplanation(assessmentId: UUID, questionId: UUID, hints: List<String>, explain: String): void 
– + getHintForQuestion(submissionId: UUID, questionId: UUID): String 
• Vai trò: Đây là "cửa ngõ" (Facade) duy nhất cho toàn bộ module.Nó che giấu sự phức tạp của các service bên trong, cung cấp một giao diện (API) đơn giản, sạch sẽ cho các client bên ngoài (như UI của Giảng viên, UI của Học viên) sử dụng. 
• Tương tác: Nhận yêu cầu từ client. Ủy quyền (delegates) yêu cầu đó đến service nội bộ thích hợp (ví dụ: creatorService để tạo bài, takerService để nộp bài). 
2. GradingService (Class) 
• Thuộc tính 
– - submissionRepo: ISubmissionRepository 
– - resultRepo: IResultRepository 
• Phương thức 
– + autoGradeSubmission(submissionId: UUID): void 
– + saveManualGrade(answerId: UUID, score: float, feedback: String): void – + finalizeGrades(submissionId: UUID): Result 
– + getSubmissionsForGrading(assessmentId: UUID): List<Submission> – + getResultForStudent(submissionId: UUID): Result 
• Vai trò: Chứa logic nghiệp vụ chấm điểm. 
• Tương tác: Sử dụng ISubmissionRepository để lấy các Answer cần chấm. Sử dụng IResultRepository để lưu Result sau khi tính toán xong. 
3. AssessmentTakerService (Class) 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 45/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Thuộc tính: 
– - submissionRepo: ISubmissionRepository 
– - assessmentRepo: IAssessmentRepository 
• Phương thức: 
– + getAssessmentsForStudent(studentId: UUID): List<Assessment> 
– + startAttempt(assessmentId: UUID, studentId: UUID): Submission – + saveAnswer(submissionId: UUID, answer: Answer): void 
– + submitAssessment(submissionId: UUID): Submission 
• Vai trò: Chứa logic nghiệp vụ thực tế cho việc học viên làm bài (bắt đầu, lưu, nộp). 
• Tương tác: Sử dụng IAssessmentRepository để kiểm tra thông tin bài đánh giá (ví dụ: thời gian). Sử dụng ISubmissionRepository để tạo, cập nhật Submission và lưu Answer vào CSDL. 
4. AssessmentCreatorService (Class) 
• Thuộc tính: 
– - assessmentRepo: IAssessmentRepository 
• Phương thức: 
– + createAssessment(config: AssessmentConfigDTO): Assessment 
– + updateAssessment(assessmentId: UUID, config: AssessmentConfigDTO): Assess ment 
– + addQuestionToAssessment(assessmentId: UUID, question: AssessmentQuestion): void 
– + removeQuestionFromAssessment(assessmentId: UUID, questionId: UUID): void 
– + updateFeedbackConfig(assessmentId: UUID, config: AssessmentFeedbackConfig): void 
• Vai trò: Chứa logic nghiệp vụ thực tế cho việc tạo và cấu hình bài đánh giá. 
• Tương tác: Sử dụng IAssessmentRepository để lưu/cập nhật dữ liệu Assessment vào CSDL. 
5. FeedbackService (Class) 
• Thuộc tính: 
– - assessmentRepo: IAssessmentRepository 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 46/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– - submissionRepo: ISubmissionRepository 
• Phương thức: 
– + requestHint(submissionId: UUID, questionId: UUID): String 
– + getExplanation(submissionId: UUID, questionId: UUID): String 
– + getFullReview(submissionId: UUID): SubmissionReviewDTO 
• Vai trò: Chịu trách nhiệm xử lý logic liên quan đến việc lấy gợi ý (kiểm tra xem có được phép không) và tổng hợp phản hồi sau khi làm bài đánh giá. 
• Tương tác: Sử dụng IAssessmentRepository và ISubmissionRepository để truy vấn gợi ý, giải thích hoặc phản hồi từ bài đánh giá. 
6. IResultRepository (Interface) 
• Phương thức: 
– + getBySubmissionId(id: UUID): Result 
– + add(result: Result): void 
• Vai trò: Đây là Repository Interface, một tầng trừu tượng (abstraction) cho việc lưu trữ và truy xuất dữ liệu Result. 
• Tương tác: Được GradingService sử dụng để thao tác cơ sở dữ liệu 
7. ISubmissionRepository (Interface) 
• Phương thức: 
– + getById(id: UUID): Submission 
– + getByStudent(studentId: UUID): List<Submission> 
– + add(submission: Submission): void 
– + update(submission: Submission): void 
• Vai trò: Đây là Repository Interface, một tầng trừu tượng (abstraction) cho việc lưu trữ và truy xuất dữ liệu Submission. 
• Tương tác: Được GradingService, AssessmentTakerService sử dụng để thao tác cơ sở dữ liệu 
8. IAssessmentRepository (Interface) 
• Phương thức: 
– + getById(id: UUID): Assessment 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 47/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + add(assessment: Assessment): void 
– + update(assessment: Assessment): void 
• Vai trò: Đây là Repository Interface, một tầng trừu tượng (abstraction) cho việc lưu trữ và truy xuất dữ liệu Assessment. 
• Tương tác: Được AssessmentCreatorService, AssessmentTakerService sử dụng để thao tác cơ sở dữ liệu 
9. ResultRepository (Class) 
• Phương thức: 
– + getBySubmissionId(id: UUID): Result 
– + add(result: Result): void 
• Vai trò: Class cụ thể triển khai interface IResultRepository. Chứa code CSDL thực tế để lưu/đọc model Result. 
• Tương tác: Triển khai IResultRepository. 
10. SubmissionRepository (Class) 
• Phương thức: 
– + getById(id: UUID): Submission 
– + getByStudent(studentId: UUID): List<Submission> 
– + add(submission: Submission): void 
– + update(submission: Submission): void 
• Vai trò: Class cụ thể triển khai interface ISubmissionRepository. Chứa code CSDL thực tế để lưu/đọc các model Submission và Answer. 
• Tương tác: Triển khai ISubmissionRepository. 
11. AssessmentRepository (Class) 
• Phương thức: 
– + getById(id: UUID): Assessment 
– + add(assessment: Assessment): void 
– + update(assessment: Assessment): void 
• Vai trò: Class cụ thể triển khai interface IAssessmentRepository. Chứa code CSDL thực tế để lưu/đọc model Assessment. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 48/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Tương tác: Triển khai IAssessmentRepository. 
12. Result (Entity) 
• Thuộc tính: 
– - resultId: UUID 
– - submissionId: UUID 
– - totalScore: Float 
– - gradeBy: UUID 
– - generalFeedback: String 
• Vai trò: Lưu trữ kết quả tổng hợp cuối cùng cho một Submission sau khi đã chấm xong. • Tương tác: Liên kết 1-1 với Submission mà nó thuộc về. 
13. Submission (Entity) 
• Thuộc tính: 
– - submissionId: UUID 
– - studentId: UUID 
– - assessmentId: UUID 
– - status: SubmissionStatus 
– - startTime: DateTime 
– - endTime: DateTime 
• Vai trò: Đại diện cho một lần nộp bài của một học viên cụ thể cho một bài đánh giá 
• Tương tác: Thuộc về một Assessment. Quan hệ 1-Nhiều với Answer (chứa nhiều câu trả lời). Quan hệ 1-1 với Result (mỗi lượt nộp có 1 kết quả cuối cùng). 
14. Assessment (Entity) 
• Thuộc tính: 
– - assessmentId: UUID 
– - title: String 
– - description: String 
– - startTime: DateTime 
– - endTime: DateTime 
– - durationInMinutes: int 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 49/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– - maxAttempts: int 
– - feedbackConfig: AssessmentFeedbackConfig 
• Vai trò: Đại diện cho một bài đánh giá. Lưu trữ các thông tin cấu hình cho bài đánh giá đó. 
• Tương tác: Quan hệ 1-Nhiều với AssessmentQuestion. Quan hệ 1-Nhiều với Submission. Quan hệ 1-1 với AssessmentFeedbackConfig. 
15. AssessmentFeedbackConfig (Entity) 
• Thuộc tính: 
– - showHints: Boolean 
– - showExplanationTiming: FeedbackTiming 
– - showAnswerTiming: FeedbackTiming 
• Vai trò: Đại diện cho cấu hình của phản hồi trong một bài đánh giá. Lưu trữ các thông tin cấu hình phản hồi cho bài đánh giá đó. 
• Tương tác: Quan hệ 1-1 với Assessment. 
16. AssessmentQuestion (Entity) 
• Thuộc tính: 
– - questionId: UUID 
– - questionType: QuestionType 
– - points: Float 
– - hints: List<String> 
– - explanation: List<String> 
• Vai trò: Nó không phải là một câu hỏi, mà là một tham chiếu đến câu hỏi, gán cho nó một số điểm cụ thể trong một Assessment. Cho phép một câu hỏi gốc (từ module Content) có thể được tái sử dụng trong nhiều bài đánh giá khác nhau với số điểm khác nhau. 
• Tương tác: Thuộc về một Assessment (một Assessment có nhiều AssessmentQuestion). 17. QuestionType (Enum) 
• Các giá trị: 
– MULTIPLE_CHOICE 
– MULTI_SECLECT 
– FILL_IN_BLANK 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 50/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– ESSAY 
• Vai trò: Định nghĩa các loại câu hỏi mà hệ thống hỗ trợ. Giúp GradingService quyết định logic chấm điểm (tự động hay thủ công). 
• Tương tác: Được AssessmentQuestion sử dụng để biết câu hỏi đó thuộc loại nào. 18. Answer (Entity) 
• Thuộc tính: 
– - answerId: UUID 
– - questionId: UUID 
– - studentAnswer: String 
– - isCorrect: Boolean 
– - score: Float 
– - feedback: String 
– - hintsUsed: Int 
• Vai trò: Lưu trữ nội dung trả lời của học viên cho một câu hỏi cụ thể. Lưu trữ điểm và phản hồi (feedback) cho câu trả lời đó sau khi chấm. 
• Tương tác: Thuộc về một Submission. 
19. SubmissionStatus (Enum) 
• Các giá trị: 
– IN_PROGRESS 
– SUBMITTED 
– GRADING 
– GRADED 
• Vai trò: Theo dõi trạng thái của một Submission (lượt nộp bài). 
• Tương tác: Được Submission sử dụng làm thuộc tính status. 
20. FeedbackTiming (Enum) 
• Các giá trị: 
– DURING_EXAM 
– IMMEDIATELY_AFTER_ANSWER 
– AFTER_SUBMISSION 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 51/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– AFTER_GRADING_COMPLETE 
– NEVER 
• Vai trò: Định nghĩa thời điểm hiển thị giải thích hoặc đáp án của 1 câu hỏi trong bài đánh giá. 
• Tương tác: Được AssessmentFeedbackConfig sử dụng để biết khi nào hiển thị giải thích hoặc đáp án. 
5.4 Instructor Dashboard Module 
Figure 18: Biểu đồ lớp Class Diagram của module Instructor Dashboard 
1. FacadeInstructorDashboard (Class) 
• Thuộc tính & Phương thức: 
– + progressMonitor: ProgressMonitorService 
– + contentEditor: ContentEditorService 
– + reportGenerator: ReportGeneratorService 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 52/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + getStudentProgress(studentId: string): ProgressData 
– + createResource(content: Content): void 
– + generateReport(criteria: ReportCriteria): File 
• Vai trò: Lớp Facade trung tâm, cung cấp một điểm truy cập duy nhất cho giảng viên, điều phối 3 service: theo dõi tiến độ, biên soạn nội dung và tạo báo cáo. 
• Tương tác: Gọi tới ProgressMonitorService, ContentEditorService, ReportGeneratorSer vice. 
2. ProgressMonitorService (Class) 
• Thuộc tính & Phương thức: 
– + studentRepo: IStudentRepository 
– + analyticsRepo: ILearningAnalyticsRepository 
– + getStudentProgress(studentId: string): ProgressData 
– + getOverallPerformanceChart(): ChartData 
• Vai trò: Service thực thi logic nghiệp vụ theo dõi tiến độ; tổng hợp dữ liệu từ Studen tRepository và LearningAnalyticsRepository để tạo ra ProgressData và biểu đồ hiệu suất tổng quan. 
• Tương tác: Sử dụng IStudentRepository, ILearningAnalyticsRepository. 3. ContentEditorService (Class) 
• Thuộc tính & Phương thức: 
– + contentRepo: IContentRepository 
– + createResource(content: Content): void 
– + updateResource(content: Content): void 
– + deleteResource(contentId: string): void 
– + assignToStudent(contentId: string, studentId: string, dueDate?: Date): void 
• Vai trò: Service quản lý vòng đời nội dung học tập (tạo, cập nhật, xoá, gán cho sinh viên theo hạn). 
• Tương tác: Sử dụng IContentRepository để thao tác dữ liệu Content. 4. ReportGeneratorService (Class) 
• Thuộc tính & Phương thức: 
– + formatters: Map<string, IReportFormatter> 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 53/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + reportRepo: IReportRepository 
– + generateReport(criteria: ReportCriteria): File 
• Vai trò: Service chịu trách nhiệm tạo báo cáo: truy xuất ReportData từ ReportRepository, sau đó chọn formatter phù hợp (PDF/Excel) để sinh file báo cáo. 
• Tương tác: Sử dụng IReportRepository và IReportFormatter. 
5. IReportFormatter (Interface) 
• Phương thức: 
– + format(data: ReportData): File 
• Vai trò: Định nghĩa chiến lược định dạng báo cáo (Strategy), cho phép plug-in nhiều formatter khác nhau. 
• Tương tác: Được cài đặt bởi PdfReportFormatter và ExcelReportFormatter. 6. IStudentRepository (Interface) 
• Phương thức & Kế thừa: 
– Extends Repository<Student> 
– + getStudentsByInstructor(instructorId: string): List<Student> 
• Vai trò: Trừu tượng hóa truy cập dữ liệu sinh viên, bổ sung nghiệp vụ tìm sinh viên theo giảng viên. 
• Tương tác: Được triển khai bởi StudentRepository. 
7. ILearningAnalyticsRepository (Interface) 
• Phương thức & Kế thừa: 
– Extends Repository<Progress> 
– + getProgressData(studentId: string): Progress 
• Vai trò: Trừu tượng hóa truy cập dữ liệu phân tích học tập cho từng sinh viên. • Tương tác: Được triển khai bởi LearningAnalyticsRepository. 
8. IContentRepository (Interface) 
• Phương thức & Kế thừa: 
– Extends Repository<Content> 
– (Kế thừa các thao tác CRUD chung từ Repository) 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 54/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Vai trò: Trừu tượng hóa truy cập dữ liệu nội dung học tập. 
• Tương tác: Được triển khai bởi ContentRepository. 
9. IReportRepository (Interface) 
• Phương thức & Kế thừa: 
– Extends Repository<ReportData> 
– (Sử dụng các phương thức chung như findById, findAll, . . . ) 
• Vai trò: Trừu tượng hóa truy cập dữ liệu ReportData. 
• Tương tác: Được triển khai bởi ReportRepository; được dùng trong ReportGeneratorSer vice. 
10. StudentRepository (Class) 
• Thuộc tính & Phương thức: 
– Implements IStudentRepository 
– Kế thừa các phương thức CRUD chung từ Repository<Student> 
– Cài đặt cụ thể truy vấn getStudentsByInstructor(. . . ) 
• Vai trò: Thực thi truy vấn dữ liệu sinh viên từ DB theo hợp đồng IStudentRepository. • Tương tác: Được sử dụng bởi ProgressMonitorService. 
11. LearningAnalyticsRepository (Class) 
• Thuộc tính & Phương thức: 
– Implements ILearningAnalyticsRepository 
– Kế thừa các phương thức CRUD từ Repository<Progress> 
– Cài đặt getProgressData(studentId: string): Progress 
• Vai trò: Thực thi truy vấn dữ liệu tiến độ học tập của sinh viên. 
• Tương tác: Được sử dụng bởi ProgressMonitorService. 
12. ContentRepository (Class) 
• Thuộc tính & Phương thức: 
– Implements IContentRepository 
– Kế thừa các phương thức CRUD từ Repository<Content> 
• Vai trò: Quản lý lưu trữ/xóa/cập nhật Content trong DB. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 55/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Tương tác: Được sử dụng bởi ContentEditorService. 
13. ReportRepository (Class) 
• Thuộc tính & Phương thức: 
– Implements IReportRepository 
– Kế thừa các phương thức CRUD từ Repository<ReportData> 
• Vai trò: Lưu trữ và truy xuất ReportData phục vụ việc sinh báo cáo. • Tương tác: Được sử dụng bởi ReportGeneratorService. 
14. PdfReportFormatter (Class) 
• Thuộc tính & Phương thức: 
– Implements IReportFormatter 
– + format(data: ReportData): File 
• Vai trò: Chuyển ReportData thành file báo cáo định dạng PDF. 
15. ExcelReportFormatter (Class) 
• Thuộc tính & Phương thức: 
– Implements IReportFormatter 
– + format(data: ReportData): File 
• Vai trò: Chuyển ReportData thành file báo cáo định dạng Excel. 
16. User (Entity) 
• Thuộc tính: 
– + id: string 
– + email: string 
– + password: string 
– + name: string 
– + role: string 
– + status: string 
– + createdAt: Date 
– + updatedAt: Date 
• Vai trò: Biểu diễn người dùng hệ thống (giảng viên, sinh viên). 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 56/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
17. Student (Entity) 
• Thuộc tính: 
– Extends User 
– + progress: Progress 
• Vai trò: Biểu diễn thông tin sinh viên, kế thừa thông tin chung từ User và gắn với Progress hiện tại. 
• Tương tác: Được thao tác bởi StudentRepository; xuất hiện trong StudentSummary. 18. Progress (Entity) 
• Thuộc tính: 
– + id: string 
– + mastery: MasteryState[] 
– + completed: int 
– + avgScore: float 
– + student: Student 
• Vai trò: Biểu diễn dữ liệu tiến độ học tập của sinh viên (số bài hoàn thành, điểm trung bình, trạng thái mastery). 
19. MasteryState (Entity) 
• Thuộc tính: 
– + topic: string 
– + confidence: float 
• Vai trò: Trạng thái làm chủ cho từng chủ đề/chương cụ thể. 
• Tương tác: Nhiều MasteryState thuộc về một Progress. 
20. Content (Entity) 
• Thuộc tính: 
– + id: string 
– + title: string 
– + type: string 
– + format: string 
– + status: string 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 57/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– + note: string 
– + createdAt: Date 
– + difficulty: Difficulty 
– + updatedAt: Date 
• Vai trò: Biểu diễn tài nguyên học tập (video, slide, tài liệu...), kèm mức độ khó. • Tương tác: Được quản lý bởi ContentRepository và ContentEditorService. 21. ReportData (Entity) 
• Thuộc tính: 
– + title: string 
– + generatedAt: Date 
– + author: string 
– + summary: string 
– + format: string 
– + students: List<StudentSummary> 
• Vai trò: Dữ liệu đầu vào cho các formatter khi tạo báo cáo. 
• Tương tác: Được lưu trong ReportRepository; là tham số cho IReportFormatter. 22. StudentSummary (Entity) 
• Thuộc tính: 
– + studentId: string 
– + email: string 
– + completedLessons: int 
– + avgScore: float 
– + mastery: MasteryState[] 
• Vai trò: Tóm tắt tiến độ của từng sinh viên trong một báo cáo. 
• Tương tác: Nhiều StudentSummary thuộc về một ReportData. 
23. «enumeration» Difficulty (Enum) 
• Giá trị: EASY, MEDIUM, HARD 
• Vai trò: Xác định mức độ khó của Content. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 58/102

Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Tương tác: Được tham chiếu bởi thuộc tính difficulty trong Content. 24. «interface» Repository (Interface) 
• Phương thức chung (theo UML): 
– + save(entity: Entity): Entity 
– + saveAll(entities: List<Entity>): List<Entity> 
– + findById(id: string): Entity 
– + findAll(): List<Entity> 
– + deleteById(id: string): void 
– + deleteAll(): void 
– + existsById(id: string): boolean 
– + count(): long 
• Vai trò: Interface chung định nghĩa các thao tác CRUD và tiện ích cho mọi loại thực thể (Entity), giúp chuẩn hóa tầng truy cập dữ liệu và giảm trùng lặp. 
• Tương tác: 
– Được extends bởi các interface chuyên biệt: 
∗ IStudentRepository 
∗ ILearningAnalyticsRepository 
∗ IContentRepository 
∗ IReportRepository 
– Các lớp triển khai cụ thể: 
∗ StudentRepository 
∗ LearningAnalyticsRepository 
∗ ContentRepository 
∗ ReportRepository 
thực thi chi tiết thao tác với cơ sở dữ liệu cho từng loại Entity tương ứng. Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 59/102

Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
5.5 Learning Management Module 
Figure 19: Biểu đồ lớp Class Diagram của module Learning Management 
1. Class: LearningContentManagementFacade 
• Attributes: 
– courseInstanceService: CourseInstanceService 
– couseService: CouseService 
– contentService: ContentService 
• Role: Là lớp trung tâm điều phối toàn bộ hoạt động của hệ thống quản lý học tập như khóa học, nội dung, bài nộp, và phiên bản khóa học. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 60/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• Interaction: Gọi đến các service tương ứng để thực hiện nghiệp vụ. 
2. Class: CouseService 
• Attributes: 
– courseRepo: ICourseRepository 
– userRepo: IUserRepository 
• Role: 
Chịu trách nhiệm xử lý toàn bộ nghiệp vụ liên quan đến Course là khóa học gốc làm nền tảng để tạo các phiên bản khóa học (CourseInstance). CourseService đảm nhiệm các tác vụ như: 
– Tạo mới một Course với thông tin cơ bản (tên, mô tả, mục tiêu). 
– Cập nhật thông tin khóa học và quản lý vòng đời của Course. 
– Gán hoặc thay đổi giảng viên phụ trách khóa học. 
– Kiểm tra ràng buộc nghiệp vụ trước khi tạo CourseInstance. 
– Hỗ trợ tìm kiếm, liệt kê và truy xuất thông tin các khóa học. 
• Interaction: Được gọi bởi lớp Facade để lưu trữ các đối tượng mới thông qua các repository. 
3. Class: CourseInstanceService 
• Attributes: 
– courseRepo: ICourseRepository 
– courseInstanceRepo: ICourseInstanceRepository 
– userRepo: IUserRepository 
• Role: 
Chịu trách nhiệm xử lý toàn bộ nghiệp vụ liên quan đến CourseInstance – đại diện cho một phiên bản cụ thể của khóa học theo lớp, nhóm hoặc học kỳ. CourseInstance Service đảm nhiệm các tác vụ như: 
– Tạo mới một phiên bản khóa học từ Course gốc. 
– Gán giảng viên phụ trách cho CourseInstance. 
– Ghi danh sinh viên vào lớp học. 
– Cập nhật thông tin lớp học (tên, trạng thái, thời gian). 
– Kiểm tra ràng buộc giữa Course và CourseInstance. 
– Quản lý quan hệ giữa CourseInstance và các Content hoặc Submission bên dưới. 
• Interaction: Được gọi bởi Facade trong các trường hợp đọc dữ liệu, thực hiện các truy vấn qua repository. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 61/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4. Class: Content Service 
• Attributes: 
– courseInstanceRepo: ICourseInstanceRepository 
– contentRepo: IContentRepository 
– attachmentRepo: IAttachmentRepository 
• Role: 
Chịu trách nhiệm quản lý toàn bộ nghiệp vụ liên quan đến nội dung học tập (Content) trong từng CourseInstance. ContentService đảm nhiệm các chức năng chính như: 
– Tạo mới nội dung hoặc bài tập gắn với một CourseInstance. 
– Cập nhật thông tin nội dung: tiêu đề, mô tả, loại nội dung, trạng thái. – Quản lý file đính kèm thông qua AttachmentRepository (thêm, sửa, xóa). – Kiểm tra ràng buộc giữa Content và CourseInstance trước khi thêm hoặc cập nhật. 
– Đảm bảo nội dung được đồng bộ với cấu trúc khóa học và quyền truy cập của giảng viên. 
Đây là service cốt lõi để đảm bảo mỗi khóa học có đầy đủ nội dung giảng dạy và bài tập theo đúng cấu trúc. 
• Interaction: Được gọi bởi Facade; ghi dữ liệu xuống repository và đảm bảo tính toàn vẹn nghiệp vụ. 
5. Class: User 
• Role: Đại diện cho người dùng trong hệ thống (Admin, Giảng viên, Sinh viên). 
• Interaction: Liên kết với CourseInstance (giảng viên) và Submission (sinh viên); được lưu trữ qua UserRepository. 
6. Class: Course 
• Role: Đại diện cho một khóa học cơ bản. 
• Interaction: Được sử dụng làm nền tảng để tạo các CourseInstance; quản lý bởi các service và repository. 
7. Class: CourseInstance 
• Role: Đại diện cho một phiên bản của khóa học, được phụ trách bởi một giảng viên cụ thể. 
• Interaction: Liên kết với Course, Content và Submission; được thao tác bởi các service tạo/cập nhật/xóa. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 62/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
8. Class: Content 
• Role: Đại diện cho nội dung học tập hoặc bài tập trong khóa học. 
• Interaction: Được quản lý bởi các service tạo, cập nhật, xóa; có thể có file đính kèm thông qua ContentAttachmentRepository. 
9. Class: Attachment 
• Role: Lưu trữ thông tin file đính kèm của nội dung học tập. 
• Interaction: Được thêm, xóa hoặc truy vấn bởi AttachmentRepository. 10. Class: CourseRepository 
• Role: Lớp triển khai cụ thể để truy cập dữ liệu của khóa học. 
• Interaction: Được sử dụng bởi các service tạo, cập nhật, và xóa khóa học. 11. Class: CourseInstanceRepository 
• Role: Lớp triển khai để quản lý lưu trữ và truy xuất thông tin phiên bản khóa học. 
• Interaction: Được dùng bởi các service để tạo, cập nhật, hoặc archive CourseIn stance. 
12. Class: UserRepository 
• Role: Lớp triển khai cụ thể cho việc truy xuất và lưu trữ dữ liệu người dùng. 
• Interaction: Được gọi bởi các service khi cần tìm giảng viên, sinh viên hoặc xác thực. 
13. Class: ContentRepository 
• Role: Lớp triển khai để thao tác dữ liệu của nội dung học tập. 
• Interaction: Được gọi bởi các service tạo, cập nhật, hoặc xóa nội dung. 14. Class: AttachmentRepository 
• Role: Lớp triển khai để thao tác dữ liệu file đính kèm của nội dung. 
• Interaction: Được gọi khi service thêm, xóa hoặc truy xuất file. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 63/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
6 Nguyên lý SOLID 
Trong quá trình thiết kế, nhóm đã cố gắng áp dụng các nguyên lý SOLID một cách rõ ràng và có hệ thống để đảm bảo mã nguồn dễ hiểu, dễ bảo trì, dễ mở rộng và dễ kiểm thử. Vì các module trong hệ thống đều được thiết kế theo một cấu trúc template thống nhất, phần minh họa dưới đây sẽ sử dụng Module Instructor Dashboard (gồm FacadeInstructorDashboard, ProgressMonitorService, ContentEditorService, ReportGeneratorService và các Repository) để giải thích cách các nguyên lý được áp dụng. 
6.1 Nguyên lý trách nhiệm đơn (Single Responsibility Principle - SRP) 
Nguyên lý này nói rằng: mỗi lớp chỉ nên làm một việc duy nhất. Nếu một lớp làm quá nhiều thứ, khi cần sửa một phần sẽ dễ làm hỏng phần khác. Vì vậy, nhóm đã chia nhỏ các chức năng ra thành từng lớp riêng biệt. 
Cách triển khai: 
• Nếu một lớp có xu hướng “phình to” hoặc chứa nhiều logic hỗn tạp, nhóm sẽ tách nó thành các lớp chuyên biệt hơn. 
• Sử dụng interface để mô tả hành vi chung (ví dụ: IStudentRepository, IContentRepository, IReportRepository). 
• Các lớp triển khai (concrete classes) chỉ xử lý đúng phạm vi của chúng. 
• Một lớp Facade (FacadeInstructorDashboard) được dùng để gom và điều phối các dịch vụ nhỏ lại, giúp lớp Controller/UI không cần làm việc trực tiếp với nhiều thành phần. 
Ví dụ: 
• ProgressMonitorService chỉ chịu trách nhiệm lấy và tổng hợp tiến độ học tập, với các phương thức như: 
– getStudentsByInstructor() 
– getProgressData() 
– getOverallPerformanceChart() 
Nó không xử lý nội dung học tập hay xuất báo cáo. 
• ContentEditorService chỉ lo quản lý nội dung học tập: tạo, sửa, xóa, gán nội dung cho sinh viên. 
• ReportGeneratorService chỉ chịu trách nhiệm tạo báo cáo, dựa trên IReportRepository và các formatter như PdfReportFormatter, ExcelReportFormatter. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 64/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Nhờ phân tách như vậy, nếu cần thay đổi thuật toán tính mastering, chỉ cần chỉnh trong ProgressMonitorService mà không ảnh hưởng các phần còn lại. 
Lợi ích thực tế: 
• Dễ đọc code: người khác nhìn vào biết ngay lớp này làm gì. 
• Dễ kiểm thử: viết test cho từng lớp nhỏ rất đơn giản. 
• Dễ sửa lỗi: lỗi ở đâu thì sửa ở đó, không sợ "động rừng". 
6.2 Nguyên lý mở/đóng (Open/Closed Principle - OCP) 
Nguyên lý này nói: mở để mở rộng, đóng để sửa đổi. Nghĩa là khi thêm tính năng mới, không được sửa code cũ, mà phải viết thêm code mới. 
Cách triển khai: 
• Các hành vi quan trọng đều được mô tả bằng interface (IReportFormatter, IContentRepository, IStudentRepository, . . . ). 
• Khi thêm chức năng mới, chỉ cần viết lớp mới implements interface tương ứng. 
• Các lớp dịch vụ (ReportGeneratorService, ContentEditorService) không phụ thuộc vào lớp cài đặt cụ thể. 
Ví dụ: 
• IReportFormatter là interface chung cho mọi định dạng báo cáo. 
• Hiện tại có hai formatter: 
– PdfReportFormatter 
– ExcelReportFormatter 
• Nếu tương lai cần thêm: 
– CsvReportFormatter 
– MarkdownReportFormatter 
→ Chỉ cần tạo lớp mới, không cần sửa ReportGeneratorService. 
Lợi ích: 
• Giảm nguy cơ lỗi khi thêm tính năng. 
• Code cũ vẫn ổn định, không bị "động chạm". 
• Dễ thêm plugin, mở rộng hệ thống sau này. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 65/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
6.3 Nguyên lý thay thế Liskov (Liskov Substitution Principle - LSP) 
Nguyên lý này bảo rằng: lớp con phải có thể thay thế hoàn toàn cho lớp cha mà không làm hệ thống bị lỗi. 
Nói đơn giản: nếu một hàm nhận tham số là User, thì truyền vào Student (là con của User) cũng phải chạy đúng. 
• Mọi lớp kế thừa đều mở rộng đúng chức năng, không phá vỡ hành vi gốc. 
• Các repository cụ thể (StudentRepository, LearningAnalyticsRepository, ReportRepository, . . . ) đều extends interface gốc Repository. 
Ví dụ: 
• Student kế thừa User nhưng không thay đổi thuộc tính cốt lõi, chỉ mở rộng thêm: 
– progress 
– status 
• Vì vậy mọi nơi nhận User đều dùng được Student. 
• Các repository như ContentRepository, ReportRepository đều thay thế được cho Repository trong các hàm xử lý chung. 
Vì vậy, bất kỳ đâu dùng User, ta có thể thay bằng Student mà không vấn đề gì. Lợi ích: 
• Code linh hoạt, có thể dùng chung. 
• Duy trì tính nhất quán khi mở rộng mô hình. 
6.4 Nguyên lý phân tách giao diện (Interface Segregation Principle - ISP) 
Nguyên lý này nói: không nên ép một lớp phải triển khai những phương thức nó không dùng. 
Thay vì tạo một interface "to đùng" chứa 10 phương thức, ta nên chia nhỏ thành nhiều interface chuyên biệt. 
Cách triển khai: 
• Chia interface theo từng nhiệm vụ: 
– IStudentRepository – chỉ quản lý dữ liệu student. 
– ILearningAnalyticsRepository – chỉ quản lý tiến độ học tập. 
– IContentRepository – chỉ quản lý nội dung học tập. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 66/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– IReportRepository – chỉ quản lý dữ liệu báo cáo. 
• Các lớp dịch vụ chỉ phụ thuộc vào interface mà chúng thực sự dùng. 
Ví dụ: 
• ProgressMonitorService chỉ cần hai interface: 
– IStudentRepository 
– ILearningAnalyticsRepository 
Nó không bị ép phải nhận IContentRepository hay IReportRepository. 
• ContentEditorService chỉ làm việc với IContentRepository. 
• ReportGeneratorService chỉ làm việc với IReportRepository và IReportFormatter. Lợi ích: 
• Interface gọn, rõ ràng, chuyên dụng. 
• Tránh lớp phải implements các phương thức không liên quan. 
• Dễ bảo trì và dễ test. 
6.5 Nguyên lý đảo ngược phụ thuộc (Dependency Inversion Principle - DIP) 
Nguyên lý này nói: lớp cấp cao không được phụ thuộc trực tiếp vào lớp cấp thấp, mà cả hai phải phụ thuộc vào abstraction (interface). 
Nói dễ hiểu: lớp nghiệp vụ (như ProgressMonitor) không được new trực tiếp StudentRepository, mà phải nhận qua interface. 
Cách triển khai: 
• Tất cả dịch vụ cấp cao đều nhận repository qua constructor injection. 
• Không có dịch vụ nào tự tạo repository bằng new, đảm bảo tách biệt giữa tầng logic và tầng dữ liệu. 
Ví dụ: 
class ProgressMonitorService { 
constructor( 
private studentRepo: IStudentRepository, 
private analyticsRepo: ILearningAnalyticsRepository 
) {} 
} 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 67/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
• ProgressMonitorService không phụ thuộc vào lớp triển khai cụ thể (StudentRepository), mà chỉ phụ thuộc vào abstraction (IStudentRepository). 
• Khi triển khai test: có thể truyền mock repository. 
• Khi đổi DB: chỉ cần tạo repository mới (ví dụ MongoStudentRepository) mà không phải sửa logic nghiệp vụ. 
Lợi ích: 
• Dễ kiểm thử (dùng mock). 
• Dễ thay đổi cơ sở dữ liệu. 
• Tách biệt rõ tầng nghiệp vụ và tầng dữ liệu. 
Kết luận phần SOLID: 
Nhờ áp dụng đầy đủ 5 nguyên lý SOLID, hệ thống của nhóm: 
• Dễ đọc, dễ hiểu → người mới vào cũng nắm được. 
• Dễ mở rộng → thêm tính năng không sợ phá code cũ. 
• Dễ kiểm thử → viết unit test nhanh chóng. 
• Dễ bảo trì → sửa lỗi ở đâu thì sửa ở đó, không ảnh hưởng chỗ khác. 
Đây chính là mục tiêu lớn nhất khi nhóm thiết kế hệ thống: không chỉ chạy được, mà phải chạy tốt và bền vững lâu dài. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 68/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
7 Phát triển trong tương lai 
Dựa trên nền tảng kiến trúc dựa trên dịch vụ (Service-based Architecture) đã xây dựng và các kết quả hiện thực ban đầu, nhóm đề xuất lộ trình phát triển hệ thống ITS trong tương lai tập trung vào ba khía cạnh chính: Nâng cao trí tuệ nhân tạo, Tối ưu hóa hạ tầng kiến trúc và Mở rộng trải nghiệm người dùng. 
7.1 Nâng cao khả năng "Thông minh" của hệ thống (Advanced AI/ML) 
Hiện tại, module Personalized Learning mới chỉ dừng lại ở các thuật toán gợi ý dựa trên luật (rule-based) hoặc thống kê đơn giản. Trong tương lai, hệ thống cần tích hợp sâu hơn các công nghệ Học máy (Machine Learning) và Xử lý ngôn ngữ tự nhiên (NLP): 
• Trợ lý ảo AI (AI Tutor Chatbot): Tích hợp các mô hình ngôn ngữ lớn (LLM) để tạo ra trợ lý ảo có khả năng giải đáp thắc mắc của học viên 24/7, giải thích chi tiết các lỗi sai trong bài tập lập trình hoặc tự luận. 
• Dự đoán kết quả học tập (Predictive Analytics): Sử dụng dữ liệu lịch sử từ Learning Analytics Repository để dự đoán khả năng trượt môn hoặc bỏ học của sinh viên, từ đó gửi cảnh báo sớm cho giảng viên để có biện pháp hỗ trợ kịp thời. 
• Chấm điểm tự động cho câu hỏi mở: Phát triển module chấm điểm sử dụng NLP để đánh giá các câu trả lời dạng văn bản (Essay) hoặc code phức tạp, giảm tải khối lượng công việc chấm thủ công cho giảng viên. 
7.2 Chuyển đổi và Tối ưu hóa Kiến trúc (Architectural Evolution) 
Mặc dù kiến trúc Service-based hiện tại đáp ứng tốt nhu cầu quy mô vừa, việc mở rộng trong tương lai để phục vụ hàng chục nghìn sinh viên đồng thời sẽ đòi hỏi các nâng cấp về hạ tầng: 
• Triển khai Kubernetes (K8s): Chuyển đổi từ Docker Compose sang Kubernetes để quản lý container tự động, hỗ trợ Auto-scaling (tự động tăng giảm số lượng pod) dựa trên tải thực tế (ví dụ: tăng resource cho Assessment Service vào mùa thi). 
• Áp dụng Serverless cho các tác vụ vụn vặt: Chuyển các tác vụ xử lý nền không yêu cầu trạng thái (stateless) như gửi email thông báo, xử lý nén video bài giảng, hoặc sinh báo cáo PDF sang kiến trúc Serverless (AWS Lambda hoặc Google Cloud Functions) để tối ưu chi phí. 
• CQRS và Event Sourcing: Đối với các module có lượng truy vấn đọc/ghi chênh lệch lớn như User Management hay Learning Content, áp dụng mẫu thiết kế CQRS (Command Query Responsibility Segregation) kết hợp với Kafka để tách biệt luồng ghi và luồng đọc, tăng tốc độ phản hồi. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 69/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
7.3 Mở rộng Hệ sinh thái và Tính năng (Ecosystem Expansion) 
• Phát triển ứng dụng di động (Mobile App): Xây dựng ứng dụng native (sử dụng Flutter hoặc React Native) để tận dụng các tính năng của thiết bị di động như thông báo đẩy (push notification), học ngoại tuyến (offline mode) và camera để nộp bài tập giấy. 
• Gamification (Trò chơi hóa): Bổ sung cơ chế điểm thưởng, huy hiệu (badges), bảng xếp hạng (leaderboard) vào module Progress Tracking để gia tăng động lực và tính cạnh tranh lành mạnh giữa các người học. 
• Tích hợp chuẩn LTI (Learning Tools Interoperability): Hỗ trợ chuẩn LTI để hệ thống ITS có thể tích hợp dễ dàng với các hệ thống LMS khác của nhà trường (như Moodle, Canvas, Blackboard) hoặc các công cụ học tập bên thứ ba (Zoom, MS Teams). 
7.4 Tăng cường Bảo mật và Giám sát thi cử (Proctoring) Để hỗ trợ tốt hơn cho việc kiểm tra đánh giá trực tuyến, hệ thống cần bổ sung: 
• AI Proctoring: Tích hợp công nghệ nhận diện khuôn mặt và theo dõi hành vi (eye tracking, tab switching detection) để giám sát tính trung thực của thí sinh trong quá trình làm bài kiểm tra online. 
• Blockchain cho chứng chỉ: Lưu trữ kết quả và chứng chỉ hoàn thành khóa học trên Blockchain để đảm bảo tính minh bạch, chống gian lận và giúp sinh viên dễ dàng chia sẻ hồ sơ năng lực. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 70/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
8 Triển Khai Code 
8.1 Source Code 
• Source Code Frontend: Click vào đây 
• Source Code Backend: Click vào đây 
Ngoài ra, để thuận tiện cho việc trải nghiệm, nhóm cũng đã deploy ứng dụng để người dùng có thể truy cập dễ dàng. Để trải nghiệm, hãy Click vào đây 
Dưới đây là danh sách tài khoản để người dùng có thể trải nghiệm: 
• Giáo viên: 
Tài khoản: admin@gmail.com 
Mật khẩu: admin 
• Giảng viên: 
Tài khoản: tuananhtramtinh@gmail.com 
Mật khẩu: 09082004 
• Sinh viên: 
Tài khoản: levanb@gmail.com 
Mật khẩu: 09082004 
8.2 Công nghệ sử dụng 
1. Ngôn ngữ lập trình Java 
Java là một ngôn ngữ lập trình hướng đối tượng và được phát hành vào năm 1995. Ngôn ngữ Java dựa trên các lớp (class) để thiết kế để có ít phụ thuộc thực thi càng tốt. Các ứng dụng Java thường được biên dịch thành bytecode để có thể chạy trên bất kỳ máy ảo Java (JVM) nào bất kể kiến trúc máy tính bên dưới, điều này giúp Java có thể viết một lần chạy ở mọi nơi (WORA). Cú pháp của Java gần như tương tự với C và C++, nhưng ít cơ sở cấp thấp hơn. 
Hiện nay, mặc dù là một ngôn ngữ lập trình "lớn tuổi" nhưng Java vẫn được nhiều doanh nghiệp vẫn tin dùng và tiếp tục sử dụng vì độ ổn định của nó, cùng với hệ sinh thái lớn cũng như sự hỗ trợ mạnh mẽ của framework Spring. 
2. Dự án Spring 
Spring là một framework được dùng để phát triển các ứng dụng Java được tin dùng và sử dụng bởi hàng triệu lập trình viên. Nó giúp tạo các ứng dụng có hiệu năng cao, dễ kiểm thử, sử dụng lại code. Ngoài ra, Spring còn giúp quản lý cấu trúc phức tạp của ứng dụng lớn. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 71/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
Spring hoạt động dựa trên cơ chế Inversion of Control (IoC) và Dependency Injection (DI) giúp tách biệt logic nghiệp vụ và logic khởi tạo đối tượng. Nhờ đó, giúp code trở nên linh hoạt, dễ mở rộng và dễ kiểm thử. 
Spring còn là một hệ sinh thái lớn, gồm nhiều dự án con chẳng hạn như SpringMVC, Spring Security, Spring Batch, ... Trong đồ án lần này, chúng ta sẽ tập trung vào việc sử dụng Spring Boot trong việc phát triển hệ thống API, kết hợp cùng với Spring Security để xác thực người dùng và Spring Data MongoDB để thao tác dữ liệu hiệu quả. Spring Boot ra đời nhằm đơn giản hoá việc cấu hình và triển khai ứng dụng Spring. Với cơ chế auto-configuration và các Starter Dependencies, lập trình viên có thể nhanh chóng khởi tạo ứng dụng chỉ trong vài phút. 
Nhờ hệ sinh thái phong phú và khả năng mở rộng mạnh mẽ, Spring Boot là nền tảng lý tưởng để xây dựng các ứng dụng doanh nghiệp hiện đại, từ hệ thống API đơn giản đến kiến trúc microservices quy mô lớn. 
3. Spring Boot 
Spring Boot là một framework nằm trong hệ sinh thái Spring, được ra đời nhằm đơn giản hoá quá trình xây dựng và triển khai ứng dụng Java. Nó giúp lập trình viên tạo ra ứng dụng Spring độc lập, có thể chạy trực tiếp mà không cần cấu hình phức tạp như trong Spring truyền thống. 
Spring Boot cung cấp sẵn các Starter, Auto-Configuration và Embedded Server (như Tom cat, Jetty) giúp việc khởi tạo và phát triển API trở nên nhanh chóng. 
4. Spring Security 
Spring Security là một module nằm trong hệ sinh thái Spring, cung cấp các cơ chế bảo mật cho ứng dụng web và REST API. Spring Security hỗ trợ xác thực (Authentication) và phân quyền người dùng, Spring Security cũng tích hợp sẵn các phương thức bảo mật phổ biến như: 
• Basic Auth, JWT, OAuth2, Session 
• Mã hoá mật khẩu 
• Chống tấn công CSRF, CORS 
5. Spring Data MongoDB 
Spring Data MongoDB là một thư viện con của Spring Data, giúp làm việc với cơ sở dữ liệu MongoDB hiệu quả hơn. Nó cho phép bạn tương tác với database thông qua các interface Repository (như MongoRepository) mà không cần viết nhiều truy vấn thủ công. Spring Data MongoDB hỗ trợ thao tác dưới dạng document thay vì bảng quan hệ như trong JPA, phù hợp với các ứng dụng NoSQL và dữ liệu phi cấu trúc. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 72/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
6. Lý do chọn Spring Framework 
Mặc dù ngôn ngữ lập trình Java có rất nhiều framework để hiện thực Backend Server. Tuy nhiên, nhóm thấy rằng Spring Framework là lựa chọn tối ưu nhất vì đây là một nền tảng backend mạnh mẽ, ổn định và phổ biến trong thực tế. Spring cung cấp hệ sinh thái đầy đủ như Spring Boot, Spring Web, Spring Data và Spring Security, giúp quá trình xây dựng REST API, quản lý dữ liệu và triển khai bảo mật trở nên đơn giản và thống nhất. Cơ chế Dependency Injection giúp cấu trúc hệ thống rõ ràng hơn, dễ mở rộng, dễ bảo trì và thuận tiện cho việc kiểm thử. 
Ngoài ra, Spring có cộng đồng lớn, tài liệu phong phú và khả năng tích hợp tốt với Docker, GitHub Actions và các công cụ DevOps, hỗ trợ nhóm phát triển nhanh chóng và theo đúng chuẩn công nghiệp. Vì vậy, Spring Framework được đánh giá là lựa chọn phù hợp và hiệu quả nhất để xây dựng backend cho đồ án. 
8.3 Cấu trúc backend 
8.3.1 Cấu trúc thư mục backend tổng quát 
its-be/ 
its-common/ 
its-eureka-server/ 
its-gateway/ 
its-learning-management/ 
its-users/ 
docker-compose.yml 
pom.xml 
Trong cấu trúc thư mục trên, chúng ta lần lượt có các thư mục cùng vai trò của chúng như sau: 
• its-be 
Dự án cha (parent project) của mô hình Maven multi–module. Chịu trách nhiệm quản lý các module con, gom cấu hình chung (plugin, phiên bản thư viện) và cho phép build toàn hệ thống bằng một lệnh duy nhất. 
• its-common 
Thư viện dùng chung giữa các service, chứa các thành phần: DTO, entity, enum, exception, response model. Module này không chạy độc lập mà được các service khác khai báo dưới dạng dependency. 
• its-eureka-server 
Service Discovery sử dụng Eureka. Module này quản lý việc đăng ký và phát hiện các microservice khác trong hệ thống. Chạy độc lập như một Spring Boot service. 
• its-gateway 
API Gateway của toàn hệ thống. Chịu trách nhiệm nhận request từ client, định tuyến đến Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 73/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
các service tương ứng, xử lý xác thực (JWT), và che giấu chi tiết kiến trúc service-based phía sau. 
• its-learning-management 
Module phụ trách nghiệp vụ quản lý học tập, bao gồm Course, CourseInstance, Learning Content và các logic liên quan. Được triển khai dưới dạng một Spring Boot service độc lập. 
• its-users 
Module phụ trách quản lý người dùng và phân quyền. Bao gồm thông tin User, Role, Permission và các API xác thực. Chạy hoàn toàn độc lập dưới dạng một microservice. 
• docker-compose.yml 
Tệp cấu hình Docker Compose, cho phép khởi chạy toàn bộ hệ thống (Eureka, Gateway, Users, Learning Management) bằng một lệnh duy nhất: docker compose up. 
• mvnw và mvnw.cmd 
Maven Wrapper giúp chạy Maven mà không cần cài đặt Maven trên máy. mvnw dành cho Linux/macOS, mvnw.cmd dành cho Windows. 
• pom.xml 
File POM cha quản lý danh sách module, cấu hình build, dependencyManagement, phiên bản Spring Boot, Lombok, MapStruct và các cấu phần chung cho toàn dự án. 
8.3.2 Cấu trúc thư mục backend cho phần xài chung 
its-common/ 
src/ 
main/ 
java/com/tuanemtramtinh/itscommon/ 
dto/ 
entity/ 
enums/ 
exception/ 
response/ 
utils/ 
resources/ 
target/ 
• its-common 
Đây là module chứa các thành phần dùng chung cho toàn bộ hệ thống. Mục tiêu của module này là tái sử dụng mã nguồn, tránh lặp lại các lớp và mô hình dữ liệu giữa các microservice. 
• src/main/java/com/tuanemtramtinh/itscommon 
Chứa toàn bộ mã nguồn Java được chia theo các nhóm chức năng: 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 74/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– dto 
Chứa các lớp Data Transfer Object dùng chung giữa nhiều service. Các DTO này giúp chuẩn hoá request/response và tránh duplicate. 
– entity 
Chứa các lớp entity mô tả cấu trúc dữ liệu chia sẻ giữa các module (ví dụ: User, Course, CourseInstance). Những entity này thường được annotation để sử dụng với MongoDB. 
– enums 
Chứa các enum dùng chung, ví dụ như trạng thái người dùng, trạng thái khoá học, role, permission hoặc các giá trị mang tính hằng số. Việc gom vào một module giúp các service đồng bộ logic. 
– exception 
Bao gồm các lớp exception tuỳ chỉnh như NotFoundException, BadRequestException, hoặc ErrorCode. Điều này cho phép các service có chung format xử lý lỗi. 
– response 
Chứa các lớp response chuẩn dùng bởi toàn hệ thống, ví dụ: ApiResponse, ErrorResponse. Mục tiêu: chuẩn hoá format trả về giữa các microservice. 
– utils 
Chứa các lớp tiện ích (utility classes) như hàm xử lý chuỗi, validate dữ liệu, convert kiểu dữ liệu, hoặc sinh mã định danh. Các tiện ích này được dùng lại ở nhiều service. 
• src/main/resources 
Chứa các cấu hình bổ sung như file YAML, file logback, hoặc các tài nguyên được bundling vào jar. Module này thường không chứa nhiều cấu hình vì vai trò chính là thư viện dùng chung. 
• target 
Thư mục sinh ra sau khi build dự án. Chứa file JAR của module (được dùng như một dependency trong các service khác). 
• pom.xml 
File cấu hình Maven cho module its-common. Định nghĩa các dependency cần thiết (ví dụ: Lombok, MongoDB, Jackson) và thiết lập để module này được build thành jar và sử dụng như một thư viện. 
8.3.3 Cấu trúc thư mục backend của từng module 
Đối với các module như its-learning-management và its-users, chúng có cùng tempate cấu trúc thư mục giống nhau và chỉ khác business logic được xây dựng bên trong mỗi module. Vì thế, nhóm sẽ lấy ví dụ cấu trúc thư mục của một module its-users để tránh sự lặp lại. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 75/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
its-users/ 
src/ 
main/ 
java/com/tuanemtramtinh/itsusers/ 
config/ 
dto/ 
mapper/ 
presentation/ 
repositories/ 
services/ 
ItsUsersApplication.java 
resources/ 
target/ 
dockerfile 
mvnw 
mvnw.cmd 
pom.xml 
• src/main/java/com/tuanemtramtinh/itsusers 
Thư mục chứa toàn bộ mã nguồn Java của microservice its-users. Kiến trúc được tổ chức theo hướng Clean Architecture / Layered Architecture. 
– config 
Chứa các cấu hình của hệ thống: cấu hình bảo mật (Spring Security), cấu hình kết nối cơ sở dữ liệu, cấu hình CORS, cấu hình JWT hoặc các bean khởi tạo. 
– dto 
Chứa các lớp Data Transfer Object, dùng để nhận dữ liệu từ client (request), trả dữ liệu về client (response) và tránh để lộ entity nội bộ ra ngoài. 
– mapper 
Chứa các lớp MapStruct mapper, chịu trách nhiệm chuyển đổi giữa entity, DTO và các lớp response. Việc tách riêng mapper giúp mã nguồn gọn gàng và dễ bảo trì. 
– presentation 
Lớp Controller của microservice. Đây là tầng giao tiếp với client, định nghĩa các endpoint REST API, validate dữ liệu đầu vào và gọi tầng service để xử lý logic nghiệp vụ. 
– repositories 
Chứa các interface repository, thường kế thừa từ MongoRepository hoặc CrudRepository. Đây là tầng truy xuất dữ liệu, giao tiếp trực tiếp với cơ sở dữ liệu MongoDB. 
– services 
Chứa logic nghiệp vụ của hệ thống. Controller gọi các lớp service để xử lý yêu cầu, kiểm tra điều kiện nghiệp vụ, tương tác repository và trả kết quả phù hợp. 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 76/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
– ItsUsersApplication.java 
Lớp main đánh dấu điểm khởi chạy của Spring Boot service. Thực thi lệnh java -jar sẽ gọi lớp này để start service. 
• src/main/resources 
Bao gồm các tài nguyên cấu hình như application.yml, file logback, schema dữ liệu và các tệp cần đóng gói kèm theo khi build. 
• target 
Thư mục sinh ra sau khi build dự án. Chứa file JAR cuối cùng (fat jar) được dùng để deploy. 
• dockerfile 
Định nghĩa cách build image Docker cho microservice its-users. Cho phép deploy hệ thống qua Docker hoặc Kubernetes. 
• mvnw và mvnw.cmd 
Maven Wrapper giúp chạy Maven mà không cần cài Maven trên máy. mvnw dành cho macOS/Linux, mvnw.cmd dành cho Windows. 
• pom.xml 
File cấu hình Maven cho module its-users, bao gồm dependency, plugin, version và các cấu hình giúp build ra JAR chạy độc lập. 
8.4 Áp dụng SOLID trong code 
Với phần code này, nhóm sẽ lấy ví dụ mẫu với module Quản lý tài nguyên học tập (Learning - Content Managment) 
8.4.1 Single Responsibility Principle (SRP) 
Theo nguyên lý Single Responsibility Principle, mỗi module hoặc class chỉ nên có một lý do duy nhất để thay đổi. Trong hệ thống, module Learning Content Management có lớp presentation là LearningContentManagementFacade có các service được chia thành nhiều service như ContentService, CourseService CourseInstanceService và CloudinaryService, trong đó mỗi service chỉ đảm nhận một trách nhiệm nghiệp vụ cụ thể. 
Ví dụ, trong module LearningContent Management, ngoài các service như ContentService, CourseService, CourseInstanceService, hệ thống còn sử dụng lớp LearningContentManagementFacade ở tầng trình bày (presentation) để làm điểm truy cập duy nhất cho các API liên quan đến quản lý nội dung học tập. 
1 package com . tuanemtramtinh . itslearningmanagement . presentation ; 
2 
3 import com . tuanemtramtinh . itscommon . dto . UserResponse ; 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 77/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
4 import com . tuanemtramtinh . itslearningmanagement . dto .*; 
5 import com . tuanemtramtinh . itslearningmanagement . services . ContentService ; 6 import com . tuanemtramtinh . itslearningmanagement . services . CourseInstanceService ; 7 import com . tuanemtramtinh . itslearningmanagement . services . CourseService ; 8 import com . tuanemtramtinh . itscommon . enums . CourseStatusEnum ; 
9 import com . tuanemtramtinh . itscommon . response . ApiResponse ; 
10 
11 import org . springframework . data . domain . Page ; 
12 import org . springframework . data . domain . Pageable ; 
13 import org . springframework . data . domain . Sort ; 
14 import org . springframework . data . web . PageableDefault ; 
15 import org . springframework . http . HttpStatus ; 
16 import org . springframework . http . MediaType ; 
17 import org . springframework . http . ResponseEntity ; 
18 import org . springframework . web . bind . annotation .*; 
19 import org . springframework . web . multipart . MultipartFile ; 
20 
21 import java . util . List ; 
22 
23 @RestController 
24 public class LearningContentManagementFacade { 
25 
26 private final CourseService courseService ; 
27 private final CourseInstanceService courseInstanceService ; 28 private final ContentService contentService ; 
29 
30 public LearningContentManagementFacade ( CourseService courseService , 31 CourseInstanceService courseInstanceService , 
32 ContentService contentService ) { 
33 this . courseService = courseService ; 
34 this . courseInstanceService = courseInstanceService ; 
35 this . contentService = contentService ; 
36 } 
37 
38 @PostMapping ("/ courses - instance / create ") 
39 public ResponseEntity < ApiResponse < CourseInstanceResponse >> createCourseInstance ( 
40 @RequestBody CourseInstanceRequest courseInstanceRequest ) { 41 CourseInstanceResponse result = courseInstanceService . createCourseInstance ( courseInstanceRequest ) ; 
42 return ResponseEntity . ok ( ApiResponse . ok (" Create new course successfully ", result )); 
43 } 
44 
45 @PostMapping ("/ courses - instance / updateStatus ") 
46 public ResponseEntity < ApiResponse < CourseInstanceUpdateStatusResponse >> updateStatusCourseInstance ( 
47 @RequestBody CourseInstanceUpdateStatusRequest 
courseInstanceUpdateStatusRequest ) { 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 78/102
Trường Đại Học Bách khoa, TP Hồ Chí Minh 
Khoa Khoa học và Kỹ thuật Máy tính 
48 CourseInstanceUpdateStatusResponse result = courseInstanceService 49 . updateStatusCourseInstance ( courseInstanceUpdateStatusRequest ); 50 return ResponseEntity . ok ( ApiResponse . ok (" Update course instance status successfully ", result ) ); 
51 } 
52 
53 @DeleteMapping ("/ courses - instance / delete ") 
54 public ResponseEntity < ApiResponse < Void >> deleteCourseInstance ( @RequestParam String courseInstanceId ) { 
55 courseInstanceService . deleteCourseInstance ( courseInstanceId ); 56 return ResponseEntity . ok ( ApiResponse . ok (" Delete course instance successfully ") ); 
57 } 
58 
59 @PostMapping ("/ courses - instance / archive ") 
60 public ResponseEntity < ApiResponse < Void >> archiveCourseInstance ( @RequestParam String courseInstanceId ) { 
61 courseInstanceService . archiveCourseInstance ( courseInstanceId ); 62 return ResponseEntity . ok ( ApiResponse . ok (" Archive course instance successfully ") ); 
63 } 
64 
65 @GetMapping ("/ courses - instance / getDetails ") 
66 public ResponseEntity < ApiResponse < CourseInstanceResponse >> getCourseInstanceDetails ( 
67 @RequestParam String courseInstanceId ) { 
68 CourseInstanceResponse result = courseInstanceService . getCourseInstanceDetails ( courseInstanceId ) ; 
69 return ResponseEntity . ok ( ApiResponse . ok (" Get course instance successfully " , result ) ); 
70 } 
71 
72 @GetMapping ("/ courses - instance / getDetailsList ") 
73 public ResponseEntity < ApiResponse < Page < CourseInstanceResponse >>> getCourseInstanceDetailsList ( 
74 @PageableDefault ( size = 10) Pageable pageable , @RequestParam ( required = false ) String teacherId , 
75 @RequestParam ( required = false ) String studentId ) { 76 Page < CourseInstanceResponse > result = courseInstanceService . getAllCourseInstanceDetails ( pageable , teacherId , 
77 studentId ); 
78 return ResponseEntity . ok ( ApiResponse . ok (" Get list course instance details successfully ", result ) ); 
79 } 
80 
81 @PostMapping ("/ courses - instance / enrollStudent ") 
82 public ResponseEntity < ApiResponse < Void >> enrollStudent ( @RequestParam String courseInstanceId , 
83 @RequestParam String studentId ) { 
Báo cáo môn Kiến trúc phần mềm - Học kỳ 251 Trang 79/102
