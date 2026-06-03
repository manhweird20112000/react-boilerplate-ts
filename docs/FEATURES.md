# Phân tích tính năng Postman

Tài liệu này tổng hợp các nhóm tính năng chính của Postman dựa trên thông tin chính thức từ:

- [Postman API Platform](https://www.postman.com/product/)
- [What is Postman?](https://www.postman.com/products/)
- [Postman Pricing](https://www.postman.com/pricing/)
- [Postman Docs](https://learning.postman.com/docs/)

## 1. Tổng quan

Postman là một nền tảng API all-in-one dùng để xây dựng, kiểm thử, tài liệu hóa, chia sẻ, giám sát và quản trị API. Postman không chỉ là công cụ gửi request HTTP, mà đã mở rộng thành nền tảng hỗ trợ toàn bộ vòng đời API: design, development, testing, documentation, collaboration, distribution, monitoring, security và governance.

## 2. API Client

Đây là nhóm tính năng cốt lõi và quen thuộc nhất của Postman.

- Gửi request API từ giao diện trực quan.
- Hỗ trợ nhiều protocol, không chỉ HTTP REST.
- Cấu hình method, URL, query params, headers, cookies và body.
- Hỗ trợ nhiều định dạng body phức tạp.
- Tích hợp nhiều kiểu authentication.
- Quản lý cookie.
- Quản lý certificate.
- Xem response body, response headers, status code và thông tin phản hồi.
- Hỗ trợ response visualization và response inspection.
- Lưu lịch sử request.
- Sử dụng biến và environment để tái sử dụng giá trị.

## 3. Collections

Collections giúp tổ chức, lưu và tự động hóa request.

- Gom nhiều request vào một collection.
- Lưu authorization, params, headers, body, scripts, variables và documentation cho từng request.
- Tổ chức request theo folder.
- Chạy nhiều request theo thứ tự bằng Collection Runner.
- Tái sử dụng collection cho manual testing, automated testing, monitors, Postman CLI và Newman.
- Chia sẻ collection với thành viên trong workspace hoặc public.

## 4. Variables và Environments

Postman cho phép lưu và tái sử dụng giá trị qua nhiều scope khác nhau.

- Global variables.
- Collection variables.
- Environment variables.
- Data variables từ CSV/JSON khi chạy collection.
- Local variables trong script hoặc một lần chạy.
- Dùng cú pháp `{{variable_name}}` để reference biến trong request.
- Tạo environment khác nhau cho local, dev, staging, production.
- Đánh dấu giá trị nhạy cảm để che trong UI.
- Chia sẻ giá trị biến với team khi cần.
- Dùng biến với Collection Runner, Monitors, Postman CLI và Newman.

## 5. API Design và Spec Hub

Postman hỗ trợ thiết kế API và quản lý API definition.

- Tạo và quản lý API definition.
- Làm việc với API specification.
- Spec Hub để quản lý spec tập trung.
- Kết nối API spec với workspace.
- Theo dõi changelog và activity feed.
- Tích hợp công cụ bên thứ ba.
- Dùng mock server để mô phỏng API từ thiết kế hoặc collection.
- Hỗ trợ cách làm API-first, contract-first.

## 6. Mock Servers

Mock server giúp mô phỏng API trước khi backend hoàn thiện.

- Tạo mock server từ collection.
- Khi gửi request vào mock server, Postman match request với example đã lưu trong collection.
- Hỗ trợ frontend, QA hoặc consumer test API mà chưa cần server thật.
- Giúp validate API contract và demo luồng tích hợp sớm.

## 7. API Documentation

Postman có thể tạo tài liệu API từ collection hoặc API spec.

- Tài liệu hóa endpoint, request, response, auth và ví dụ sử dụng.
- Tạo documentation từ collection/API.
- Tài liệu mặc định là private.
- Có thể publish public documentation cho API public.
- Hỗ trợ custom-branded documentation ở một số gói trả phí.
- Có tích hợp AI để hỗ trợ tạo và cập nhật mô tả endpoint.
- Có tích hợp Fern/docs-as-code cho tài liệu nâng cao.

## 8. API Testing

Postman hỗ trợ cả manual testing và automated testing.

- Viết test script cho request.
- Chạy collection bằng Collection Runner.
- Automated testing.
- Data-driven testing với file dữ liệu.
- Integration testing.
- Regression testing.
- End-to-end testing.
- Performance testing.
- CI/CD testing.
- AI-generated tests.
- Reusable scripts.
- Dynamic test variables.
- Test run summary.
- Chạy test bằng Postman CLI hoặc Newman.

## 9. Monitoring

Postman Monitors dùng để kiểm tra API định kỳ.

- Tạo monitor từ collection.
- Chạy collection theo lịch từ Postman cloud.
- Theo dõi health và performance của API.
- Validate response và chạy test cho workflow quan trọng.
- Theo dõi HTTP response code, failures và latency.
- Cảnh báo khi test fail.
- Hỗ trợ multi-region và static IP allowlisting ở các gói phù hợp.

## 10. Collaboration và Workspaces

Postman được thiết kế cho cá nhân, team và tổ chức lớn.

- Workspace cá nhân, team, partner hoặc public.
- Chia sẻ collection, environment, API, mock server, monitor và documentation.
- Team collaboration.
- Workspace và collection viewers.
- Role-based access control theo gói.
- Activity feed để theo dõi thay đổi.
- Public workspaces để chia sẻ API ra cộng đồng.
- Partner/internal workspaces cho hợp tác có kiểm soát.

## 11. API Repository và API Catalog

Postman cung cấp kho tập trung cho API artifacts.

- Lưu API specifications, documentation, workflow recipes, test cases, test results và metrics.
- Repository cloud-based, version-controlled.
- API Catalog để quản lý, tìm kiếm, govern và monitor API/service từ một nơi.
- Universal search để tìm API, workspace, collection và artifacts.
- Service auto-discovery từ repository hoặc gateway được kết nối.
- Hiển thị ownership, trạng thái, chất lượng và liên kết giữa services.

## 12. API Distribution và API Network

Postman hỗ trợ phân phối và khám phá API.

- Public API Network.
- Private API Network.
- Public workspaces.
- Publish version.
- Run in Postman button.
- Team verification.
- Integrated third-party auth.
- Public workspace metrics.
- Giúp API producer chia sẻ API cho developer nội bộ, partner hoặc cộng đồng.

## 13. Postman Flows

Postman Flows là công cụ visual builder để tạo workflow API.

- Xây dựng API-driven workflow bằng canvas trực quan.
- Kết nối các block để mô phỏng luồng dữ liệu.
- Chạy workflow thủ công hoặc tự động tùy gói.
- Dùng Flows credits cho các bước orchestration/automation.
- Phù hợp cho automation, prototype, tích hợp hệ thống và workflow logic không cần viết nhiều code.

## 14. AI

Postman có các tính năng AI hỗ trợ vòng đời API.

- Agent Mode để hỗ trợ tạo request, collection, tests và Flows.
- AI-generated tests.
- Phân tích response và hỗ trợ troubleshoot API behavior.
- Tự động hóa tài liệu và workflow steps.
- Postman MCP server và MCP catalog.
- AI credits được tính theo gói sử dụng.

## 15. Security, Secrets và Governance

Postman có nhóm tính năng bảo mật và quản trị cho team/enterprise.

- Postman Vault để lưu secrets.
- Secret Scanner.
- Third-party vault integrations.
- Advanced identity management.
- SSO qua Google Workspace, Microsoft Entra ID, Okta, OneLogin, Ping, Duo, AD FS hoặc custom SAML ở gói/add-on phù hợp.
- BYOK ở enterprise.
- Audit logs.
- Custom tags.
- Built-in rule library.
- Custom governance rules.
- Spectral support.
- Security và governance reports.
- API conformance visibility trong API Catalog.

## 16. Integrations, CLI và Automation

Postman tích hợp với quy trình phát triển phần mềm.

- Postman CLI.
- Newman.
- CI integrations.
- Git/native Git workflows.
- Third-party integrations.
- Postman API để mở rộng và tự động hóa.
- Postman Interceptor.
- SDK generation ở gói phù hợp.
- CLI generation.
- NPM packages và shared package library ở một số gói.

## 17. Gói sử dụng

Postman có nhiều gói tùy theo quy mô sử dụng.

- Free: cho cá nhân build và test API cơ bản.
- Solo: cho cá nhân cần thêm AI, automation và monitoring mở rộng.
- Team: cho nhóm cần collaboration, viewers, RBAC cơ bản và SDK generation.
- Enterprise: cho tổ chức lớn cần governance, advanced security, catalog, reports, audit logs và quản trị sâu hơn.

Một số tính năng có giới hạn hoặc tính phí theo usage:

- AI credits.
- Monitoring requests.
- Flows credits.
- Insights.
- Add-ons bảo mật hoặc premium support.

## 18. Kết luận

Postman hiện là một nền tảng API hoàn chỉnh, bao phủ nhiều nhu cầu:

- Developer dùng để gửi request, debug API, quản lý collections và environments.
- QA/tester dùng để viết test, chạy collection, regression test và monitor API.
- Team dùng để cộng tác, chia sẻ workspace, documentation và mock server.
- Organization dùng để quản trị API catalog, security, governance, CI/CD và observability.

Nếu cần xây một sản phẩm tương tự Postman, phần lõi nên ưu tiên theo thứ tự:

1. API client: request builder, auth, params, headers, body, response viewer.
2. Collections và environments.
3. Tests/scripts và collection runner.
4. Mock server và documentation.
5. Workspace collaboration.
6. Monitoring và CI/CD.
7. API catalog, governance, security và AI.
