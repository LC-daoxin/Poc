USE [master]
GO
/****** Object:  Database [DF_POC]    Script Date: 2022/10/27 9:15:14 ******/
CREATE DATABASE [DF_POC]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'DF_POC', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DF_POC.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'DF_POC_log', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DF_POC_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [DF_POC] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [DF_POC].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [DF_POC] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [DF_POC] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [DF_POC] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [DF_POC] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [DF_POC] SET ARITHABORT OFF 
GO
ALTER DATABASE [DF_POC] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [DF_POC] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [DF_POC] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [DF_POC] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [DF_POC] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [DF_POC] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [DF_POC] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [DF_POC] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [DF_POC] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [DF_POC] SET  DISABLE_BROKER 
GO
ALTER DATABASE [DF_POC] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [DF_POC] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [DF_POC] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [DF_POC] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [DF_POC] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [DF_POC] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [DF_POC] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [DF_POC] SET RECOVERY FULL 
GO
ALTER DATABASE [DF_POC] SET  MULTI_USER 
GO
ALTER DATABASE [DF_POC] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [DF_POC] SET DB_CHAINING OFF 
GO
ALTER DATABASE [DF_POC] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [DF_POC] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [DF_POC] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'DF_POC', N'ON'
GO
USE [DF_POC]
GO
/****** Object:  Table [dbo].[T_Activity_BaseData]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Activity_BaseData](
	[ActivityID] [uniqueidentifier] NOT NULL,
	[ActivityName] [varchar](255) NULL,
	[ActivityNameCN] [varchar](255) NULL,
	[ActivityDesc] [varchar](255) NULL,
	[ActivityDescCN] [varchar](255) NULL,
	[ActivityShortName] [varchar](255) NULL,
	[ActivityShortNameCN] [varchar](255) NULL,
	[TemplateID] [uniqueidentifier] NULL,
	[ParentID] [uniqueidentifier] NULL,
	[ProjectID] [varchar](255) NULL,
	[KeyWordID] [varchar](255) NULL,
	[PipelineModolID] [varchar](255) NULL,
	[Type1ModolID] [varchar](255) NULL,
	[Type2ModolID] [varchar](255) NULL,
	[StageCN] [varchar](255) NULL,
	[Stage] [varchar](255) NULL,
	[Price] [varchar](255) NULL,
	[PriceMark] [varchar](255) NULL,
	[PassThroughPrice] [varchar](255) NULL,
	[PassThroughPriceMark] [varchar](255) NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[Duration] [varchar](255) NULL,
	[DisCount] [varchar](255) NULL,
	[Scale] [varchar](255) NULL,
	[Property2] [varchar](255) NULL,
	[Property3] [varchar](255) NULL,
	[Property4] [varchar](255) NULL,
	[Property5] [varchar](255) NULL,
	[Property6] [varchar](255) NULL,
	[Property7] [varchar](255) NULL,
	[Property8] [varchar](255) NULL,
	[Property9] [varchar](255) NULL,
	[Property10] [varchar](255) NULL,
	[Property11] [varchar](255) NULL,
	[Property12] [varchar](255) NULL,
	[Property13] [varchar](255) NULL,
	[Property14] [varchar](255) NULL,
	[Property15] [varchar](255) NULL,
	[Property16] [varchar](255) NULL,
	[Property17] [varchar](255) NULL,
	[Property18] [varchar](255) NULL,
	[Property19] [varchar](255) NULL,
	[Property20] [varchar](255) NULL,
	[Sort] [int] NULL,
	[Version] [varchar](255) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
 CONSTRAINT [PK_T_Activity_BaseData_ActivityID] PRIMARY KEY CLUSTERED 
(
	[ActivityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Activity_Instance]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Activity_Instance](
	[InstanceID] [uniqueidentifier] NOT NULL,
	[BatchID] [uniqueidentifier] NULL,
	[IP] [varchar](255) NULL,
	[FileName] [varchar](255) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
	[Version] [varchar](255) NULL,
	[ApproveStatus] [varchar](255) NULL,
 CONSTRAINT [PK_T_Activity_Instance_InstanceID] PRIMARY KEY CLUSTERED 
(
	[InstanceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Activity_SaveData]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Activity_SaveData](
	[ID] [uniqueidentifier] NOT NULL,
	[ActivityID] [uniqueidentifier] NULL,
	[ActivityName] [varchar](255) NULL,
	[ActivityNameCN] [varchar](255) NULL,
	[ActivityDesc] [varchar](255) NULL,
	[ActivityDescCN] [varchar](255) NULL,
	[ActivityShortName] [varchar](255) NULL,
	[ActivityShortNameCN] [varchar](255) NULL,
	[ParentID] [uniqueidentifier] NULL,
	[TemplateID] [uniqueidentifier] NULL,
	[ProjectID] [varchar](255) NULL,
	[PipelineModolID] [varchar](255) NULL,
	[StageCN] [varchar](255) NULL,
	[Stage] [varchar](255) NULL,
	[Price] [varchar](255) NULL,
	[PriceMark] [varchar](255) NULL,
	[PassThroughPrice] [varchar](255) NULL,
	[PassThroughPriceMark] [varchar](255) NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[Duration] [varchar](255) NULL,
	[DisCount] [varchar](255) NULL,
	[Scale] [varchar](255) NULL,
	[Property2] [varchar](255) NULL,
	[Property3] [varchar](255) NULL,
	[Property4] [varchar](255) NULL,
	[Property5] [varchar](255) NULL,
	[Property6] [varchar](255) NULL,
	[Property7] [varchar](255) NULL,
	[Property8] [varchar](255) NULL,
	[Property9] [varchar](255) NULL,
	[Property10] [varchar](255) NULL,
	[Property11] [varchar](255) NULL,
	[Property12] [varchar](255) NULL,
	[Property13] [varchar](255) NULL,
	[Property14] [varchar](255) NULL,
	[Property15] [varchar](255) NULL,
	[Property16] [varchar](255) NULL,
	[Property17] [varchar](255) NULL,
	[Property18] [varchar](255) NULL,
	[Property19] [varchar](255) NULL,
	[Property20] [varchar](255) NULL,
	[Sort] [int] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
	[BatchID] [uniqueidentifier] NULL,
	[CreateDate] [datetime] NULL,
 CONSTRAINT [PK_T_Activity_SaveData_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Activity_Type]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Activity_Type](
	[TypeID] [uniqueidentifier] NOT NULL,
	[ParentID] [uniqueidentifier] NULL,
	[ActivetName] [varchar](255) NULL,
	[Type] [int] NULL,
	[Version] [varchar](255) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
 CONSTRAINT [PK_T_Activity_Type_TypeID] PRIMARY KEY CLUSTERED 
(
	[TypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Activity_Word_Log]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Activity_Word_Log](
	[ID] [uniqueidentifier] NOT NULL,
	[FileName] [varchar](255) NULL,
	[Operation] [varchar](255) NULL,
	[Author] [varchar](255) NULL,
	[InnerText] [varchar](255) NULL,
	[UpdateTime] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
 CONSTRAINT [PK_T_Activity_Word_Log_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Contract_BaseData]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Contract_BaseData](
	[MasterID] [uniqueidentifier] NOT NULL,
	[ProjectName] [varchar](255) NULL,
	[Client] [varchar](255) NULL,
	[Trustee] [varchar](255) NULL,
	[BeginDate] [varchar](255) NULL,
	[EndDate] [varchar](255) NULL,
	[ClientName] [varchar](255) NULL,
	[TrusteeName] [varchar](255) NULL,
	[ClientTelephone] [varchar](255) NULL,
	[TrusteeTelephone] [varchar](255) NULL,
	[ClientPhone] [varchar](255) NULL,
	[Trusteephone] [varchar](255) NULL,
	[Organization] [varchar](255) NULL,
	[ClientEmail] [varchar](255) NULL,
	[TrusteeEmail] [varchar](255) NULL,
	[ClientAddress] [varchar](255) NULL,
	[TrusteeAddress] [varchar](255) NULL,
	[Total] [varchar](255) NULL,
	[StartUpFunds] [varchar](255) NULL,
	[OneFee] [varchar](255) NULL,
	[ValidTo] [datetime] NULL,
	[FillerCost] [varchar](255) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
	[BatchID] [varchar](255) NULL,
	[IP] [varchar](255) NULL,
	[FileName] [varchar](255) NULL,
	[Name] [varchar](255) NULL,
	[Title] [varchar](255) NULL,
	[CompanyName] [varchar](255) NULL,
	[Address] [varchar](255) NULL,
	[PostalCode] [varchar](255) NULL,
	[Email] [varchar](255) NULL,
	[ClientTitle] [varchar](255) NULL,
	[ClientBy] [varchar](255) NULL,
	[PaymentDate] [varchar](255) NULL,
	[ApproveStatus] [varchar](255) NULL,
 CONSTRAINT [PK_T_Contract_BaseData_MasterID] PRIMARY KEY CLUSTERED 
(
	[MasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_CRM_MasterData]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_CRM_MasterData](
	[MasterID] [uniqueidentifier] NOT NULL,
	[ProjectNameCN] [varchar](255) NULL,
	[ProjectName] [varchar](255) NULL,
	[CorporateNameCN] [varchar](255) NULL,
	[CorporateName] [varchar](255) NULL,
	[ProjectID] [varchar](255) NULL,
	[ClientNameCN] [varchar](255) NULL,
	[ClientName] [varchar](255) NULL,
	[OrganizationCN] [varchar](255) NULL,
	[Organization] [varchar](255) NULL,
	[FullAddressCN] [varchar](255) NULL,
	[FullAddress] [varchar](255) NULL,
	[ClientEmail] [varchar](255) NULL,
	[ClientPhone] [varchar](255) NULL,
	[TechnicalContractCN] [varchar](255) NULL,
	[TechnicalContract] [varchar](255) NULL,
	[BusinessContractCN] [varchar](255) NULL,
	[BusinessContract] [varchar](255) NULL,
	[CustomerServiceCN] [varchar](255) NULL,
	[CustomerService] [varchar](255) NULL,
	[DateIssued] [datetime] NULL,
	[ValidTo] [datetime] NULL,
	[Version] [varchar](255) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
	[ApproveStatus] [varchar](255) NULL,
 CONSTRAINT [PK_T_CRM_MasterData_MasterID] PRIMARY KEY CLUSTERED 
(
	[MasterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Department]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Department](
	[ID] [uniqueidentifier] NOT NULL,
	[DepartName] [varchar](255) NULL,
	[ParentID] [uniqueidentifier] NULL,
	[Description] [varchar](255) NULL,
	[OrgCode] [varchar](255) NULL,
	[CreateTime] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[Sort] [int] NULL,
	[Status] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
 CONSTRAINT [PK_T_Department_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_KeyWord]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_KeyWord](
	[ID] [uniqueidentifier] NOT NULL,
	[TemplateID] [uniqueidentifier] NULL,
	[Key] [varchar](255) NULL,
	[CNValues] [varchar](255) NULL,
	[ENValues] [varchar](255) NULL,
	[Tpye] [int] NULL,
	[CreateDate] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
 CONSTRAINT [PK_T_KeyWord_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Menu]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Menu](
	[Gid] [uniqueidentifier] NOT NULL,
	[id] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[parentId] [varchar](255) NULL,
	[component] [varchar](255) NULL,
	[redirect] [varchar](255) NULL,
	[path] [varchar](255) NULL,
	[sort] [int] NULL,
 CONSTRAINT [PK_T_Menu_Gid] PRIMARY KEY CLUSTERED 
(
	[Gid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_MenuTitle]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_MenuTitle](
	[Gid] [uniqueidentifier] NOT NULL,
	[ParentID] [uniqueidentifier] NULL,
	[icon] [varchar](255) NULL,
	[title] [varchar](255) NULL,
	[show] [varchar](255) NULL,
 CONSTRAINT [PK_T_MenuTitle_Gid] PRIMARY KEY CLUSTERED 
(
	[Gid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMS_SplitRule]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMS_SplitRule](
	[ID] [uniqueidentifier] NOT NULL,
	[SplitName] [varchar](255) NOT NULL,
	[SplitDesc] [varchar](255) NOT NULL,
	[SplitType] [int] NOT NULL,
	[Version] [varchar](255) NOT NULL,
	[Effictive] [datetime] NOT NULL,
	[Status] [int] NOT NULL,
	[Sort] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [varchar](255) NOT NULL,
	[IsDelete] [varchar](255) NOT NULL,
	[ActivityID] [uniqueidentifier] NOT NULL,
	[Language] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_PMS_SplitRule_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSData]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSData](
	[ID] [uniqueidentifier] NOT NULL,
	[ActivityID] [uniqueidentifier] NULL,
	[Json] [varchar](4500) NULL,
	[Sort] [varchar](4500) NULL,
	[SplitRuleID] [uniqueidentifier] NULL,
	[Language] [varchar](255) NULL,
 CONSTRAINT [PK_T_PMSData_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSDataAttribute]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSDataAttribute](
	[ID] [uniqueidentifier] NOT NULL,
	[Type] [varchar](255) NULL,
	[Value] [varchar](255) NULL,
 CONSTRAINT [PK_T_PMSDataAttribute_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSDataBYUser]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSDataBYUser](
	[ID] [uniqueidentifier] NOT NULL,
	[ActivityID] [uniqueidentifier] NULL,
	[Json] [varchar](4500) NULL,
	[Sort] [varchar](255) NULL,
	[SplitRuleID] [uniqueidentifier] NULL,
	[UserID] [uniqueidentifier] NULL,
	[Language] [varchar](255) NULL,
 CONSTRAINT [PK_T_PMSDataBYUser_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSDataSplit]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSDataSplit](
	[ID] [uniqueidentifier] NOT NULL,
	[Type] [varchar](255) NULL,
	[LeftOperatorExpression] [uniqueidentifier] NULL,
	[CompareOperation] [varchar](255) NULL,
	[RightOperatorExpression] [uniqueidentifier] NULL,
	[PMSID] [uniqueidentifier] NULL,
	[ParentID] [uniqueidentifier] NULL,
	[Sort] [int] NULL,
	[ActivityID] [uniqueidentifier] NULL,
	[Language] [varchar](255) NULL,
 CONSTRAINT [PK_T_PMSDataSplit_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSDataSplitResult]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSDataSplitResult](
	[ID] [uniqueidentifier] NOT NULL,
	[ActivityID] [uniqueidentifier] NULL,
	[ActivityNo] [int] NULL,
	[Description] [varchar](255) NULL,
	[Revenue] [decimal](18, 4) NULL,
	[Discount] [decimal](18, 4) NULL,
	[ActualRevenue] [decimal](18, 4) NULL,
	[BU] [varchar](255) NULL,
	[SubBU] [varchar](255) NULL,
	[MilestoneCode] [varchar](255) NULL,
	[Batch] [varchar](255) NULL,
	[StartDate] [varchar](255) NULL,
	[ReportDeliverDate] [varchar](255) NULL,
	[RRDate] [varchar](255) NULL,
	[Deliverables] [varchar](255) NULL,
	[Comments] [varchar](255) NULL,
	[CreateTime] [varchar](255) NULL,
	[CreateName] [varchar](255) NULL,
	[Sort] [int] NULL,
	[BatchID] [uniqueidentifier] NULL,
 CONSTRAINT [PK_T_PMSDataSplitResult_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PMSRules]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PMSRules](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[TierIndex] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_PMSRules_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Property_Mapping]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Property_Mapping](
	[MappingID] [uniqueidentifier] NOT NULL,
	[PropertyNum] [varchar](255) NOT NULL,
	[PropertyName] [varchar](255) NOT NULL,
	[PropertyDesc] [varchar](255) NOT NULL,
	[PropertyType] [varchar](255) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [varchar](255) NOT NULL,
	[IsDelete] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_Property_Mapping_MappingID] PRIMARY KEY CLUSTERED 
(
	[MappingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_PropertyOfActivity]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_PropertyOfActivity](
	[ID] [uniqueidentifier] NOT NULL,
	[TemplateID] [uniqueidentifier] NOT NULL,
	[ServiceDescription] [varchar](255) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [varchar](255) NOT NULL,
	[IsDelete] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_PropertyOfActivity_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Proposal_Instance]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Proposal_Instance](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[URL] [varchar](255) NOT NULL,
	[TempDesc] [varchar](255) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [varchar](255) NOT NULL,
	[IsDelete] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_Proposal_Instance_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_Proposal_Template]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_Proposal_Template](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[URL] [varchar](255) NOT NULL,
	[TempDesc] [varchar](255) NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[CreateUser] [varchar](255) NOT NULL,
	[IsDelete] [varchar](255) NOT NULL,
 CONSTRAINT [PK_T_Proposal_Template_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_User]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[T_User](
	[ID] [uniqueidentifier] NOT NULL,
	[UserName] [varchar](255) NULL,
	[PassWord] [varchar](255) NULL,
	[DepartmentID] [uniqueidentifier] NULL,
	[DepartmentName] [varchar](255) NULL,
	[Sex] [varchar](255) NULL,
	[Mobile] [varchar](255) NULL,
	[Status] [varchar](255) NULL,
	[CreateTime] [datetime] NULL,
	[CreateUser] [varchar](255) NULL,
	[IsDelete] [varchar](255) NULL,
	[Sort] [varchar](255) NULL,
 CONSTRAINT [PK_T_User_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[T_UserMenu]    Script Date: 2022/10/27 9:15:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[T_UserMenu](
	[ID] [uniqueidentifier] NOT NULL,
	[UserID] [uniqueidentifier] NOT NULL,
	[MenuID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_T_UserMenu_ID] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
USE [master]
GO
ALTER DATABASE [DF_POC] SET  READ_WRITE 
GO
