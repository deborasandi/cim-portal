# CIM Portal

Portal de pedidos da **CIMsystem**. Os clientes fazem os pedidos pelo site, sem precisar mandar PDF por e-mail, e cada pedido vira um **Estimate** no **QuickBooks Online** via API.

> **Status:** protótipo navegável em HTML/CSS. A aplicação Ruby on Rails vem na próxima etapa.

**Demo:** `https://<seu-usuario>.github.io/cim-portal/` (veja [Publicar no GitHub Pages](#publicar-no-github-pages))

---

## Telas do protótipo

| Tela | Arquivo | Quem acessa | View Rails futura |
|---|---|---|---|
| Índice do protótipo | `docs/index.html` | — | (só no protótipo) |
| Login | `docs/sessions/new.html` | Todos | `sessions/new` |
| Criar conta | `docs/registrations/new.html` | Todos | `registrations/new` |
| Esqueci a senha | `docs/passwords/new.html` | Todos | `passwords/new` |
| Nova senha | `docs/passwords/edit.html` | Todos (com token) | `passwords/edit` |
| Meus pedidos | `docs/estimates/index.html` | Cliente | `estimates/index` |
| Novo pedido | `docs/estimates/new.html` | Cliente | `estimates/new` |
| Detalhes do pedido (ver / cancelar) | `docs/estimates/show.html?id=1057` | Cliente | `estimates/show` |
| Editar pedido | `docs/estimates/edit.html?id=1057` | Cliente | `estimates/edit` |
| Clientes | `docs/admin/customers/index.html` | Funcionário | `admin/customers/index` |
| Cliente (produtos e pedidos) | `docs/admin/customers/show.html?id=58` | Funcionário | `admin/customers/show` |
| Grupos de produtos | `docs/admin/product_groups/index.html` | Funcionário | `admin/product_groups/index` |
| Grupo de produtos | `docs/admin/product_groups/show.html?id=g1` | Funcionário | `admin/product_groups/show` |

Na tela de login há atalhos **"Customer"** e **"CIMsystem staff"** para navegar como cada perfil sem precisar de senha (só no protótipo).

## Estrutura

```
cim-portal/
├── README.md
├── .gitignore
└── docs/                          ← protótipo (servido pelo GitHub Pages)
    ├── index.html                 ← índice com todas as telas
    ├── sessions/ registrations/ passwords/
    ├── estimates/                 ← área do cliente
    ├── admin/                     ← área dos funcionários
    │   ├── customers/
    │   └── product_groups/
    └── assets/
        ├── stylesheets/           → app/assets/stylesheets/
        │   ├── base.css           (tokens de cor/fonte, reset)
        │   ├── layout.css         (menu lateral, barra superior, rodapé, layout de auth)
        │   ├── components.css     (botões, forms, cards, tabelas, badges)
        │   └── pages.css          (estilos específicos de telas)
        ├── javascripts/
        │   ├── application.js     (mini-registro estilo Stimulus)
        │   ├── controllers/       → app/javascript/controllers/ (Stimulus)
        │   └── data/mock_data.js  (dados fictícios no formato da API do QuickBooks)
        └── images/
```

### Por que essa organização facilita a migração para Rails

- **Pastas = controllers Rails.** `docs/estimates/new.html` vira `app/views/estimates/new.html.erb`, e assim por diante. Cada HTML tem um comentário no topo indicando a view correspondente.
- **CSS sem framework**, dividido em arquivos que podem ir direto para `app/assets/stylesheets/` (Propshaft, padrão do Rails 8).
- **JavaScript com convenções do Stimulus** (`data-controller`, `data-*-target`, `data-action`). Cada arquivo em `controllers/` vira um controller Stimulus com poucas mudanças.
- **Nomes de campos no padrão Rails** (`estimate[po_number]`, `estimate[lines][0][qty]`), prontos para `form_with` e *strong params*.
- **`data-qb="..."`** em cada campo do pedido indica o campo do Estimate no QuickBooks para onde ele vai.
- **Menu lateral para todos** (cliente e funcionário): no desktop ele recolhe para mostrar só os ícones, e a escolha fica salva no navegador. No mobile vira uma gaveta. Os itens do menu mudam conforme o perfil.
- O menu lateral, a barra superior e o rodapé se repetem em cada HTML e no Rails viram `layouts/application.html.erb` + partials `_sidebar` e `_topbar`.

## Mapeamento: Novo pedido → QuickBooks Estimate

| Campo no portal | Campo no QuickBooks Online (Estimate) |
|---|---|
| Customer (cliente logado) | `CustomerRef` |
| PO number | Custom field "P.O. Number" (configurar no QBO) |
| Order date | `TxnDate` |
| Email for the estimate | `BillEmail` |
| Payment terms (somente leitura) | `SalesTermRef` (vem do cadastro do cliente) |
| Ship to (endereço) | `ShipAddr` |
| Ship via | `ShipMethodRef` |
| Product | `Line[].SalesItemLineDetail.ItemRef` |
| Description | `Line[].Description` |
| Qty | `Line[].SalesItemLineDetail.Qty` |
| Unit price (somente leitura) | `Line[].SalesItemLineDetail.UnitPrice` |
| Due date | `Line[].SalesItemLineDetail.ServiceDate` |
| Message to CIMsystem | `CustomerMemo` |
| Revision, contato, item # do cliente, conta da transportadora, FOB | `PrivateNote` (ou custom fields) |
| Purchase order PDF | `Attachable` (upload vinculado ao Estimate) |

## Modelo de dados previsto (Rails)

```
User             email, password_digest, role (customer | staff | admin), customer_id (nullable)
Customer         quickbooks_id, display_name, email, sales_term, bill_addr, ship_addr   ← sincronizado do QB
Product          quickbooks_id, sku, name, description, unit_price, item_type, category, active  ← sincronizado do QB
ProductGroup     name, description                                  ← grupos (ex.: "Roland labs")
ProductGroupItem product_group_id, product_id
CustomerProductGroup customer_id, product_group_id                  ← grupos atribuídos ao cliente
CustomerProduct  customer_id, product_id                            ← produtos avulsos do cliente
Estimate         customer_id, user_id, po_number, txn_date, ship_addr, ship_method, memo,
                 status, quickbooks_id, quickbooks_doc_number
                 has_one_attached :purchase_order_pdf
EstimateLine     estimate_id, product_id, description, customer_item_number, qty, unit_price, service_date
```

Produtos que o cliente pode pedir = produtos dos grupos dele **+** produtos avulsos. Para listas grandes, a busca, os filtros e a paginação de clientes devem rodar no servidor (por exemplo com `pagy` + Turbo Frames).

## Status do pedido

Os funcionários revisam, aprovam e recusam os pedidos **no QuickBooks** (Estimates). O portal não tem tela de pedidos para a equipe e só mostra ao cliente o status sincronizado do QuickBooks (por webhook ou sincronização periódica).

| Status no portal | Status do Estimate no QuickBooks | Quem muda |
|---|---|---|
| Pending review | Pending | Criado quando o cliente envia o pedido |
| Approved | Accepted | Funcionário, no QuickBooks |
| Rejected | Rejected | Funcionário, no QuickBooks (de onde vem o motivo mostrado ao cliente: a definir) |
| Cancelled | A definir (Rejected ou excluir o Estimate) | Cliente cancela no portal enquanto está pendente |
| Closed | Closed (virou fatura) | QuickBooks |

No protótipo, editar e cancelar só aparecem para pedidos *Pending review*. As regras de negócio definitivas serão implementadas no Rails.

Os PDFs em `docs/assets/samples/` são pedidos de compra fictícios, usados nos links de PDF do protótipo.

## Regras de permissão

| Ação | Cliente | Funcionário |
|---|---|---|
| Ver e criar os próprios pedidos | ✅ | — |
| Ver pedidos de todos os clientes | — | No QuickBooks |
| Ver só os produtos liberados para o cliente | ✅ | — |
| Editar ou cancelar o próprio pedido (pendente) | ✅ | — |
| Aprovar ou recusar pedidos | — | No QuickBooks |
| Definir os produtos de cada cliente | — | ✅ |
| Vincular conta do portal ao cliente do QuickBooks | ✅ (futuro) | ✅ |

## Fluxo de cadastro (futuro)

1. A CIMsystem cadastra o cliente no QuickBooks.
2. O cliente cria uma conta no portal (só e-mail e senha).
3. O cliente vincula a conta ao cadastro dele no QuickBooks (por exemplo, pelo e-mail do cadastro ou por um código enviado pela CIMsystem).
4. Depois de vinculado, ele vê os produtos liberados e pode fazer pedidos.

## Rodar localmente

Não precisa instalar nada. Abra `docs/index.html` no navegador ou, para evitar problemas com caminhos:

```bash
cd docs
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub chamado `cim-portal` (pode ser público ou privado*).
2. Envie o projeto:
   ```bash
   git init
   git add .
   git commit -m "CIM Portal HTML prototype"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/cim-portal.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch **`main`**, pasta **`/docs`**, **Save**.
4. Em 1 a 2 minutos o site fica disponível em `https://<seu-usuario>.github.io/cim-portal/`.

\* No plano gratuito, o GitHub Pages só funciona com repositório **público**. Para repositório privado é preciso um plano pago (Pro/Team). Os dados do protótipo são fictícios.

Quando o app Rails for criado na raiz do repositório, a pasta `docs/` pode continuar servindo como protótipo e referência visual.
